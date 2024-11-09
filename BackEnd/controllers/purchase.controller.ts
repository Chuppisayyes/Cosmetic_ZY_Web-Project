import { body } from 'express-validator'
import { Request, Response } from 'express'
import { STATUS } from '../constants/status'
import { ProductModel } from '../database/models/product.model'
import { PaymentModel } from '../database/models/payment.model'
import { PurchaseModel } from '../database/models/purchase.model'
import { ErrorHandler, responseError, responseSuccess } from '../utils/response'

import { cloneDeep } from 'lodash'
import { STATUS_ORDER, STATUS_PURCHASE } from '../constants/purchase'

export const addToCart = async (req: Request, res: Response) => {
  const { product_id, buy_count } = req.body
  const product: any = await ProductModel.findById(product_id).lean()
  if (product) {
    if (buy_count > product.quantity) {
      throw new ErrorHandler(
        STATUS.NOT_ACCEPTABLE,
        'Số lượng vượt quá số lượng sản phẩm'
      )
    }
    const purchaseInDb: any = await PurchaseModel.findOne({
      user: req.jwtDecoded.id,
      status: STATUS_PURCHASE.INCART,
      product: {
        _id: product_id,
      },
    }).populate({
      path: 'product',
      populate: {
        path: 'category',
      },
    })
    let data
    if (purchaseInDb) {
      data = await PurchaseModel.findOneAndUpdate(
        {
          user: req.jwtDecoded.id,
          status: STATUS_PURCHASE.INCART,
          product: {
            _id: product_id,
          },
        },
        {
          buy_count: purchaseInDb.buy_count + buy_count,
        },
        {
          new: true,
        }
      )
        .populate({
          path: 'product',
          populate: {
            path: 'category',
          },
        })
        .lean()
    } else {
      const purchase = {
        user: req.jwtDecoded.id,
        product: product._id,
        buy_count: buy_count,
        price: product.price,
        price_before_discount: product.price_before_discount,
        status: STATUS_PURCHASE.INCART,
      }
      const addedPurchase = await new PurchaseModel(purchase).save()
      data = await PurchaseModel.findById(addedPurchase._id).populate({
        path: 'product',
        populate: {
          path: 'category',
        },
      })
    }
    const response = {
      message: 'Thêm sản phẩm vào giỏ hàng thành công',
      data,
    }
    return responseSuccess(res, response)
  } else {
    throw new ErrorHandler(STATUS.NOT_FOUND, 'Không tìm thấy sản phẩm')
  }
}

export const updatePurchase = async (req: Request, res: Response) => {
  const { product_id, buy_count } = req.body
  const purchaseInDb: any = await PurchaseModel.findOne({
    user: req.jwtDecoded.id,
    status: STATUS_PURCHASE.INCART,
    product: {
      _id: product_id,
    },
  })
    .populate({
      path: 'product',
      populate: {
        path: 'category',
      },
    })
    .lean()
  if (purchaseInDb) {
    if (buy_count > purchaseInDb.product.quantity) {
      throw new ErrorHandler(
        STATUS.NOT_ACCEPTABLE,
        'Số lượng vượt quá số lượng sản phẩm'
      )
    }
    const data = await PurchaseModel.findOneAndUpdate(
      {
        user: req.jwtDecoded.id,
        status: STATUS_PURCHASE.INCART,
        product: {
          _id: product_id,
        },
      },
      {
        buy_count,
      },
      {
        new: true,
      }
    )
      .populate({
        path: 'product',
        populate: {
          path: 'category',
        },
      })
      .lean()
    const response = {
      message: 'Cập nhật giỏ hàng thành công',
      data,
    }
    return responseSuccess(res, response)
  } else {
    throw new ErrorHandler(
      STATUS.NOT_FOUND,
      'Không tìm thấy sản phẩm cần cập nhật'
    )
  }
}

export const buyProducts = async (req: Request, res: Response) => {
  try {
    const purchase = []
    const { order, ...rest } = req.body

    for (const item of order) {
      const product: any = await ProductModel.findById(item.product_id).lean()
      if (product) {
        if (item.buy_count > product.quantity) {
          throw new ErrorHandler(
            STATUS.NOT_ACCEPTABLE,
            'Số lượng mua vượt quá số lượng sản phẩm'
          )
        } else {
          let data = await PurchaseModel.findOneAndUpdate(
            {
              user: req.jwtDecoded.id,
              status: STATUS_PURCHASE.INCART,
              product: item.product_id,
            },
            {
              buy_count: item.buy_count,
              status: STATUS_PURCHASE.OUTCART,
            },
            { new: true }
          )
            .populate({
              path: 'product',
              populate: {
                path: 'category',
              },
            })
            .lean()

          await ProductModel.findByIdAndUpdate(item.product_id, {
            $inc: {
              quantity: -Number(item.buy_count),
              sold: +Number(item.buy_count),
            },
          })

          if (!data) {
            const newPurchase = new PurchaseModel({
              user: req.jwtDecoded.id,
              product: item.product_id,
              buy_count: item.buy_count,
              price: product.price,
              price_before_discount: product.price_before_discount,
              status: STATUS_PURCHASE.OUTCART,
            })

            const addedPurchase = await newPurchase.save()
            data = await PurchaseModel.findById(addedPurchase._id)
          }
          purchase.push(data)
        }
      } else {
        throw new ErrorHandler(STATUS.NOT_FOUND, 'Không tìm thấy sản phẩm')
      }
    }

    const paymentProducts = purchase.map((item) => {
      const product = item.product
      return {
        product: {
          name: product.name,
          image: product.image,
          price: product.price,
        },
        buy_count: item.buy_count,
        price: product.price,
      }
    })

    const totalMoney = paymentProducts.reduce(
      (acc, item) => acc + item.price * item.buy_count,
      0
    )

    const paymentData = {
      ...rest,
      purchases: paymentProducts,
      totalMoney,
      user: req.jwtDecoded.id,
    }

    const newPayment = await PaymentModel.create(paymentData)

    const populatedPayment = await PaymentModel.findById(newPayment._id)
      .populate({
        path: 'purchases',
      })
      .lean()

    const response = {
      message: 'Mua thành công',
      data: populatedPayment,
    }

    return responseSuccess(res, response)
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || 'Internal Server Error',
    })
  }
}

export const getPurchases = async (req: Request, res: Response) => {
  const { status = STATUS_PURCHASE.OUTCART } = req.query
  const user_id = req.jwtDecoded.id

  let condition: any = {
    user: user_id,
    'product.status': {
      $ne: 0, // Loại bỏ các sản phẩm có status = 0
    },
  }

  // Nếu status là OUTCART, loại bỏ điều kiện lọc sản phẩm OUTCART
  if (Number(status) !== STATUS_PURCHASE.OUTCART) {
    condition.status = status
  }

  let purchases: any = await PurchaseModel.find(condition)
    .populate({
      path: 'product',
      populate: {
        path: 'category',
      },
    })
    .sort({
      createdAt: -1,
    })
    .lean()

  purchases = purchases
    .map((purchase) => {
      if (purchase.product.status === 0) {
        purchase.status = 0 // Đặt purchase.status = 0 nếu product.status = 0
      }
      return purchase
    })
    .filter((purchase) => purchase.status !== 0) // Loại bỏ các mục có purchase.status = 0

  const response = {
    message: 'Lấy giỏ hàng thành công',
    data: purchases,
  }
  return responseSuccess(res, response)
}

export const deletePurchases = async (req: Request, res: Response) => {
  const purchase_ids = req.body
  const user_id = req.jwtDecoded.id
  const deletedData = await PurchaseModel.deleteMany({
    user: user_id,
    status: STATUS_PURCHASE.INCART,
    _id: { $in: purchase_ids },
  })
  return responseSuccess(res, {
    message: `Xoá sản phẩm ${deletedData.deletedCount} ra khỏi giỏ hàng thành công`,
    data: { deleted_count: deletedData.deletedCount },
  })
}
