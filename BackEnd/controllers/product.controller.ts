import { Request, Response } from 'express'
import { responseSuccess, ErrorHandler, responseError } from '../utils/response'
import { ProductModel } from '../database/models/product.model'
import { STATUS } from '../constants/status'
import mongoose from 'mongoose'
import { isAdmin } from '../utils/validate'
import { uploadFile, uploadManyFile } from '../utils/upload'
import { HOST } from '../utils/helper'
import { FOLDERS, FOLDER_UPLOAD, ROUTE_IMAGE } from '../constants/config'
import fs from 'fs'
import { omitBy } from 'lodash'
import { ORDER, SORT_BY } from '../constants/product'

// Hàm xóa hình ảnh sản phẩm
const removeImageProduct = (image) => {
  // Kiểm tra nếu hình ảnh có tồn tại và không phải là chuỗi rỗng
  if (image !== undefined && image !== '') {
    // Xóa file hình ảnh trong thư mục upload
    fs.unlink(`${FOLDER_UPLOAD}/${FOLDERS.PRODUCT}/${image}`, (err) => {
      if (err) console.error(err) // Nếu có lỗi, in lỗi ra console
    })
  }
}

// Hàm xóa nhiều hình ảnh sản phẩm
const removeManyImageProduct = (images: string[]) => {
  // Kiểm tra nếu mảng hình ảnh không rỗng
  if (images !== undefined && images.length > 0) {
    // Duyệt qua từng hình ảnh và gọi hàm removeImageProduct
    images.forEach((image) => {
      removeImageProduct(image)
    })
  }
}

// Hàm thêm sản phẩm mới
const addProduct = async (req: Request, res: Response) => {
  try {
    const form: Product = req.body // Lấy dữ liệu từ body request
    const {
      name,
      description,
      category,
      image,
      images,
      brand,
      price,
      price_before_discount,
      quantity,
      uses,
      status,
      madeIn,
    } = form // Destructure các thuộc tính của sản phẩm

    // Định nghĩa đối tượng sản phẩm cần thêm
    const product = {
      name,
      description,
      category,
      image,
      images,
      brand,
      price,
      rating: 0, // Giá trị mặc định cho rating là 0
      price_before_discount,
      quantity,
      uses,
      sold: 0, // Giá trị mặc định cho sold là 0
      view: 0, // Giá trị mặc định cho view là 0
      status: 1, // Giá trị mặc định cho status là 1
      madeIn,
    }

    // Lưu sản phẩm vào cơ sở dữ liệu
    const productAdd = await new ProductModel(product).save()

    // Xử lý và trả về thông báo thành công
    const response = {
      message: 'Tạo sản phẩm thành công',
      data: productAdd.toObject({
        transform: (doc, ret, option) => {
          delete ret.__v // Xóa thuộc tính __v trong kết quả trả về
          return ret
        },
      }),
    }
    return responseSuccess(res, response) // Trả kết quả thành công
  } catch (error) {
    console.log(error) // In lỗi ra console nếu có lỗi
    return responseError(res, 'Không thể tạo sản phẩm') // Trả thông báo lỗi
  }
}

// Hàm lấy danh sách sản phẩm theo các điều kiện lọc
const getProducts = async (req: Request, res: Response) => {
  let {
    page = 1,
    limit = 100,
    category,
    exclude,
    brand,
    sort_by,
    order,
    rating_filter,
    price_max,
    price_min,
    name,
    status,
  } = req.query as {
    [key: string]: string | number
  }

  // Chuyển đổi các giá trị page và limit sang kiểu số
  page = Number(page)
  limit = Number(limit)
  
  let condition: any = {} // Điều kiện lọc sản phẩm
  
  // Thêm điều kiện lọc nếu có các tham số
  if (category) {
    condition.category = category
  }
  if (brand) {
    condition.brand = brand
  }
  if (exclude) {
    condition._id = { $ne: exclude } // Loại trừ sản phẩm theo ID
  }
  if (rating_filter) {
    condition.rating = { $gte: rating_filter } // Lọc sản phẩm theo rating
  }
  if (price_max) {
    condition.price = {
      $lte: price_max, // Lọc sản phẩm có giá nhỏ hơn hoặc bằng price_max
    }
  }
  if (price_min) {
    condition.price = condition.price
      ? { ...condition.price, $gte: price_min } // Lọc sản phẩm có giá lớn hơn hoặc bằng price_min
      : { $gte: price_min }
  }

  // Kiểm tra giá trị order và sort_by có hợp lệ không
  if (!ORDER.includes(order as string)) {
    order = ORDER[0] // Mặc định là 'asc' nếu order không hợp lệ
  }
  if (!SORT_BY.includes(sort_by as string)) {
    sort_by = SORT_BY[0] // Mặc định là 'createdAt' nếu sort_by không hợp lệ
  }

  // Lọc sản phẩm theo tên nếu có tham số name
  if (name) {
    condition.name = {
      $regex: name,
      $options: 'i', // Tìm kiếm không phân biệt chữ hoa/thường
    }
  }

  // Lọc theo trạng thái sản phẩm
  if (status) {
    condition.status = status
  }

  // Thực hiện truy vấn và trả về danh sách sản phẩm và tổng số sản phẩm
  let [products, totalProducts]: [products: any, totalProducts: any] =
    await Promise.all([
      ProductModel.find(condition) // Tìm sản phẩm theo điều kiện lọc
        .populate({ path: 'category brand' }) // Lấy thông tin category và brand
        .sort({ [sort_by]: order === 'desc' ? -1 : 1 }) // Sắp xếp sản phẩm theo điều kiện
        .skip(page * limit - limit) // Phân trang
        .limit(limit) // Giới hạn số lượng sản phẩm trả về
        .select({ __v: 0, description: 0 }) // Loại bỏ trường __v và description
        .lean(),
      ProductModel.find(condition).countDocuments().lean(), // Đếm tổng số sản phẩm
    ])

  const page_size = Math.ceil(totalProducts / limit) || 1
  const response = {
    message: 'Lấy các sản phẩm thành công',
    data: {
      products,
      pagination: {
        page,
        limit,
        page_size,
      },
    },
  }
  return responseSuccess(res, response)
}


// Hàm lấy tất cả các sản phẩm
const getAllProducts = async (req: Request, res: Response) => {
  let { category } = req.query // Lấy category từ query string
  let condition: any = { status: { $ne: 0 } } // Điều kiện tìm kiếm, loại trừ sản phẩm có status = 0 (sản phẩm đã xóa)
  if (category) { // Nếu có category, thêm điều kiện vào tìm kiếm
    condition.category = category
  }

  let products: any = await ProductModel.find(condition) // Lấy các sản phẩm theo điều kiện
    .populate({ path: 'category brand' }) // Lấy thông tin danh mục và thương hiệu
    .sort({ createdAt: -1 }) // Sắp xếp sản phẩm theo ngày tạo giảm dần
    .select({ __v: 0, description: 0 }) // Bỏ trường __v và description
    .lean() // Chuyển đổi dữ liệu thành plain object
  // products = products.map((product) => handleImageProduct(product)) // Xử lý hình ảnh sản phẩm (nếu có)
  const response = {
    message: 'Lấy tất cả sản phẩm thành công', // Thông báo khi lấy sản phẩm thành công
    data: products, // Danh sách sản phẩm
  }
  return responseSuccess(res, response) // Trả về phản hồi thành công
}

// Hàm lấy các sản phẩm đã bị xóa
const getProductDelete = async (req: Request, res: Response) => {
  try {
    const productDB: any = await ProductModel.find({ status: 0 }) // Tìm sản phẩm có status = 0 (đã xóa)
      .populate({ path: 'category brand' }) // Lấy thông tin danh mục và thương hiệu
      .sort({ createdAt: -1 }) // Sắp xếp theo ngày tạo giảm dần
      .select({ __v: 0, description: 0 }) // Bỏ trường __v và description
      .lean() // Chuyển dữ liệu thành plain object

    return responseSuccess(res, {
      message: `Lấy danh sách sản phẩm đã xóa thành công`, // Thông báo thành công
      data: productDB, // Danh sách sản phẩm đã xóa
    })
  } catch (error) {
    return responseError(res, 'Lỗi khi lấy sản phẩm đã xóa') // Thông báo lỗi nếu có vấn đề
  }
}

// Hàm lấy chi tiết sản phẩm
const getProduct = async (req: Request, res: Response) => {
  let condition = { _id: req.params.product_id } // Lấy product_id từ params
  const productDB: any = await ProductModel.findOneAndUpdate(
    condition, // Tìm sản phẩm theo product_id
    { $inc: { view: 1 } }, // Tăng lượt xem sản phẩm lên 1
    { new: true } // Trả về dữ liệu sản phẩm mới cập nhật
  )
    .populate('category') // Lấy thông tin danh mục của sản phẩm
    .populate({
      path: 'comment.user', // Lấy thông tin người dùng đã bình luận
      select: 'email', // Chỉ lấy email của người dùng
    })
    .select({ __v: 0 }) // Bỏ trường __v
    .lean() // Chuyển dữ liệu thành plain object
  if (productDB) {
    const response = {
      message: 'Lấy sản phẩm thành công', // Thông báo thành công khi tìm thấy sản phẩm
      data: productDB, // Dữ liệu sản phẩm
    }
    return responseSuccess(res, response) // Trả về phản hồi thành công
  } else {
    throw new ErrorHandler(STATUS.NOT_FOUND, 'Không tìm thấy sản phẩm') // Nếu không tìm thấy sản phẩm, trả về lỗi
  }
}
// Hàm cập nhật thông tin sản phẩm
const updateProduct = async (req: Request, res: Response) => {
  const form: Product = req.body // Lấy dữ liệu từ body yêu cầu
  const {
    name,
    description,
    category,
    image,
    images,
    brand,
    price,
    price_before_discount,
    quantity,
    uses,
    madeIn,
  } = form // Tách các trường cần cập nhật từ form

  // Lọc bỏ các trường không có giá trị (undefined hoặc empty string)
  const product = omitBy(
    {
      name,
      description,
      category,
      image,
      images,
      brand,
      price,
      price_before_discount,
      quantity,
      uses,
      madeIn,
    },
    (value) => value === undefined || value === ''
  )

  // Cập nhật sản phẩm trong cơ sở dữ liệu
  const productDB = await ProductModel.findByIdAndUpdate(
    req.params.product_id, // Tìm sản phẩm theo product_id
    product, // Cập nhật sản phẩm với dữ liệu mới
    {
      new: true, // Trả về bản ghi mới sau khi cập nhật
    }
  )
    .select({ __v: 0 }) // Bỏ trường __v
    .lean() // Chuyển thành plain object

  if (productDB) {
    const response = {
      message: 'Cập nhật sản phẩm thành công', // Thông báo khi cập nhật thành công
      data: productDB, // Dữ liệu sản phẩm đã cập nhật
    }
    return responseSuccess(res, response) // Trả về phản hồi thành công
  } else {
    throw new ErrorHandler(STATUS.NOT_FOUND, 'Không tìm thấy sản phẩm') // Thông báo lỗi nếu không tìm thấy sản phẩm
  }
}

// Hàm xóa sản phẩm (cập nhật trạng thái sản phẩm thành 0)
const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product_id = req.params.product_id // Lấy product_id từ params
    const productDB: any = await ProductModel.findByIdAndUpdate(
      product_id, // Tìm sản phẩm theo product_id
      { status: 0 }, // Cập nhật trạng thái sản phẩm thành 0 (xóa sản phẩm)
      { new: true } // Trả về bản ghi sau khi cập nhật
    ).lean() // Chuyển thành plain object

    if (productDB) {
      return responseSuccess(res, {
        message: 'Xóa thành công', // Thông báo khi xóa thành công
        data: productDB, // Dữ liệu sản phẩm đã xóa
      })
    } else {
      throw new ErrorHandler(STATUS.NOT_FOUND, 'Không tìm thấy sản phẩm') // Thông báo lỗi nếu không tìm thấy sản phẩm
    }
  } catch (error) {
    return responseError(res, 'Lỗi khi xóa sản phẩm') // Thông báo lỗi nếu có lỗi xảy ra
  }
}

// Hàm xóa số lượng của sản phẩm (cập nhật trạng thái thành 0)
const deleteQuantityProducts = async (req: Request, res: Response) => {
  const productId = req.body.product_id // Lấy product_id từ body yêu cầu

  // Kiểm tra nếu không có product_id thì trả về lỗi
  if (!productId) {
    throw new ErrorHandler(
      STATUS.BAD_REQUEST,
      'Thông tin xóa sản phẩm không hợp lệ'
    )
  }

  const productDB: any = await ProductModel.findById(productId).lean() // Tìm sản phẩm theo product_id

  // Kiểm tra nếu không tìm thấy sản phẩm thì trả về lỗi
  if (!productDB) {
    throw new ErrorHandler(
      STATUS.NOT_FOUND,
      'Không tìm thấy sản phẩm để xóa số lượng'
    )
  }

  // Cập nhật trạng thái sản phẩm thành 0 (xóa)
  productDB.status = 0
  await ProductModel.findByIdAndUpdate(productId, productDB) // Cập nhật sản phẩm trong cơ sở dữ liệu

  return responseSuccess(res, {
    message: `Đã xóa ${productDB.name} thành công`, // Thông báo khi xóa thành công
    data: productDB, // Dữ liệu sản phẩm đã được xóa
  })
}

// Hàm khôi phục sản phẩm (cập nhật trạng thái và số lượng)
const updateDeleteProduct = async (req: Request, res: Response) => {
  const form: Product = req.body // Lấy dữ liệu từ body yêu cầu
  const { quantity } = form // Lấy số lượng sản phẩm từ form

  // Lọc bỏ các trường không có giá trị
  const product = omitBy(
    {
      status: 1, // Đặt trạng thái sản phẩm thành 1 (khôi phục)
      quantity, // Cập nhật lại số lượng sản phẩm
    },
    (value) => value === undefined
  )

  // Cập nhật sản phẩm trong cơ sở dữ liệu
  const productDB = await ProductModel.findByIdAndUpdate(
    req.params.product_id, // Tìm sản phẩm theo product_id
    product, // Cập nhật sản phẩm với dữ liệu mới
    {
      new: true, // Trả về bản ghi mới sau khi cập nhật
    }
  )
    .select({ __v: 0 }) // Bỏ trường __v
    .lean() // Chuyển thành plain object

  if (productDB) {
    const response = {
      message: 'Khôi phục sản phẩm thành công', // Thông báo khi khôi phục thành công
      data: productDB, // Dữ liệu sản phẩm đã khôi phục
    }
    return responseSuccess(res, response) // Trả về phản hồi thành công
  } else {
    throw new ErrorHandler(STATUS.NOT_FOUND, 'Không tìm thấy sản phẩm') // Thông báo lỗi nếu không tìm thấy sản phẩm
  }
}
// Hàm tìm kiếm sản phẩm theo từ khóa
const searchProduct = async (req: Request, res: Response) => {
  let { searchText }: { [key: string]: string | any } = req.query // Lấy từ khóa tìm kiếm từ query
  searchText = decodeURI(searchText) // Giải mã URL nếu cần thiết
  let condition = { $text: { $search: `\"${searchText}\"` } } // Tạo điều kiện tìm kiếm với cú pháp text search
  if (!isAdmin(req)) { // Nếu người dùng không phải admin, chỉ hiển thị sản phẩm công khai
    condition = Object.assign(condition, { visible: true })
  }

  // Tìm sản phẩm theo điều kiện và sắp xếp theo thời gian tạo sản phẩm giảm dần
  let products: any = await ProductModel.find(condition)
    .populate('category') // Lấy thông tin category liên quan
    .sort({ createdAt: -1 }) // Sắp xếp theo thời gian tạo sản phẩm
    .select({ __v: 0, description: 0 }) // Không trả về trường __v và description
    .lean() // Chuyển thành plain object

  const response = {
    message: 'Tìm các sản phẩm thành công', // Thông báo khi tìm kiếm thành công
    data: products, // Dữ liệu sản phẩm tìm được
  }
  return responseSuccess(res, response) // Trả về phản hồi thành công
}

// Hàm upload ảnh sản phẩm
const uploadProductImage = async (req: Request, res: Response) => {
  const path = await uploadFile(req, FOLDERS.PRODUCT) // Upload file ảnh vào thư mục sản phẩm
  const response = {
    message: 'Upload ảnh thành công', // Thông báo khi upload thành công
    data: path, // Đường dẫn ảnh đã upload
  }
  return responseSuccess(res, response) // Trả về phản hồi thành công
}

// Hàm upload nhiều ảnh sản phẩm
const uploadManyProductImages = async (req: Request, res: Response) => {
  const paths = await uploadManyFile(req, FOLDERS.PRODUCT) // Upload nhiều file ảnh vào thư mục sản phẩm
  const response = {
    message: 'Upload các ảnh thành công', // Thông báo khi upload nhiều ảnh thành công
    data: paths, // Danh sách đường dẫn các ảnh đã upload
  }
  return responseSuccess(res, response) // Trả về phản hồi thành công
}

// Hàm upload ảnh cho brand (thương hiệu)
const uploadBrandImage = async (req: Request, res: Response) => {
  const path = await uploadFile(req, FOLDERS.BRAND) // Upload ảnh vào thư mục brand
  const response = {
    message: 'Upload ảnh của brand thành công', // Thông báo khi upload ảnh cho brand thành công
    data: path, // Đường dẫn ảnh đã upload
  }
  return responseSuccess(res, response) // Trả về phản hồi thành công
}

// Hàm lấy tổng số lượng sản phẩm bán được theo danh mục
const getSoldProductByCategory = async (req: Request, res: Response) => {
  const categoryId = req.params.categoryId // Lấy categoryId từ tham số URL
  try {
    const products: any = await ProductModel.find({ category: categoryId }) // Tìm các sản phẩm theo categoryId
      .populate({ path: 'category brand' }) // Lấy thông tin category và brand liên quan
      .lean() // Chuyển thành plain object

    let totalSold = 0 // Khởi tạo biến tổng số lượng đã bán
    for (const product of products) {
      const soldCount = product.sold || 0 // Lấy số lượng bán, mặc định là 0 nếu không có
      totalSold += soldCount // Cộng dồn số lượng bán vào tổng
    }
    const response = {
      message: 'Lấy tất cả sản phẩm thành công', // Thông báo khi lấy sản phẩm thành công
      data: {
        products: products, // Dữ liệu các sản phẩm trong danh mục
        totalSold: totalSold, // Tổng số lượng đã bán
      },
    }
    return responseSuccess(res, response) // Trả về phản hồi thành công
  } catch (error) {
    // Xử lý lỗi nếu có
    res.status(500).json({ error: 'Lỗi khi lấy sản phẩm từ danh mục' }) // Thông báo lỗi server nếu có lỗi
  }
}

// Hàm lấy tổng số lượng sản phẩm bán được theo thương hiệu
const getSoldProductByBrand = async (req: Request, res: Response) => {
  const brandId = req.params.brandId // Lấy brandId từ tham số URL
  try {
    const products: any = await ProductModel.find({ brand: brandId }) // Tìm các sản phẩm theo brandId
      .populate({ path: 'category brand' }) // Lấy thông tin category và brand liên quan
      .lean() // Chuyển thành plain object

    let totalSold = 0 // Khởi tạo biến tổng số lượng đã bán
    for (const product of products) {
      const soldCount = product.sold || 0 // Lấy số lượng bán, mặc định là 0 nếu không có
      totalSold += soldCount // Cộng dồn số lượng bán vào tổng
    }
    const response = {
      message: 'Lấy tất cả sản phẩm thành công', // Thông báo khi lấy sản phẩm thành công
      data: {
        products: products, // Dữ liệu các sản phẩm của thương hiệu
        totalSold: totalSold, // Tổng số lượng đã bán
      },
    }
    return responseSuccess(res, response) // Trả về phản hồi thành công
  } catch (error) {
    // Xử lý lỗi nếu có
    res.status(500).json({ error: 'Lỗi khi lấy sản phẩm từ thương hiệu' }) // Thông báo lỗi server nếu có lỗi
  }
}
// Hàm thêm bình luận vào sản phẩm
const addCommentToProduct = async (req: Request, res: Response) => {
  const product_id = req.params.product_id // Lấy product_id từ tham số URL
  const { user, rating, commentItem } = req.body // Lấy thông tin người dùng, đánh giá và nội dung bình luận từ body của yêu cầu

  try {
    // Tìm và cập nhật sản phẩm trong database bằng cách thêm bình luận mới vào mảng "comment"
    const product: any = await ProductModel.findByIdAndUpdate(
      product_id, // Tìm sản phẩm theo ID
      {
        $push: {
          comment: { // Thêm một bình luận mới vào mảng comment của sản phẩm
            user: req.jwtDecoded.id, // Lấy ID người dùng từ jwtDecoded (thường được giải mã từ token)
            rating: rating, // Đánh giá sản phẩm (rating)
            commentItem: commentItem, // Nội dung bình luận
            date: new Date(), // Thời gian thêm bình luận
          },
        },
      },
      { new: true } // Trả về sản phẩm sau khi đã cập nhật
    )

    // Nếu không tìm thấy sản phẩm, trả về lỗi 404
    if (!product) {
      return res.status(404).json({ error: 'Sản phẩm không tồn tại' })
    }

    // Trả về phản hồi thành công với sản phẩm đã được thêm bình luận
    return res
      .status(200)
      .json({ message: 'Đã thêm comment thành công', data: product })
  } catch (error) {
    // Xử lý lỗi nếu có (thường là lỗi kết nối database hoặc lỗi khi thêm bình luận)
    console.error('Lỗi khi thêm comment vào sản phẩm:', error)
    return res.status(500).json({ error: 'Lỗi khi thêm comment vào sản phẩm' })
  }
}

// Đối tượng chứa tất cả các controller cho sản phẩm
const ProductController = {
  addProduct,
  getAllProducts,
  getProductDelete,
  getProducts,
  getProduct,
  updateProduct,
  searchProduct,
  deleteProduct,
  updateDeleteProduct,
  deleteQuantityProducts,
  uploadProductImage,
  uploadManyProductImages,
  uploadBrandImage,
  getSoldProductByCategory,
  getSoldProductByBrand,
  addCommentToProduct, // Thêm hàm thêm bình luận vào sản phẩm
}

export default ProductController
