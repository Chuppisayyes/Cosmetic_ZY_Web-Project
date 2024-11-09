import { SkincareFormModel } from '../database/models/skincare-form.model'
import { Request, Response } from 'express'
import axios from 'axios'
import { ProductModel } from '../database/models/product.model'

async function callAIRecommendationAPI(SkincareData) {
  try {
    // Thay đổi URL này với đường dẫn API thực tế
    const response = await axios.post(
      'http://127.0.0.1:8000/recommend',
      SkincareData
    )
    // console.log(response)

    return {
      aiRecommendationIds: response.data[0],
      additionalData: response.data[1],
      reasoning: response.data[2],
    }
  } catch (error) {
    console.error(
      'Error calling AI Recommendation API:',
      error.response ? error.response.data : error.message
    )
    throw new Error('Failed to get recommendation from AI API')
  }
}

async function getProductsDetails(productIds) {
  try {
    const products = await ProductModel.find({
      _id: { $in: productIds },
    })
      .populate('category brand')
      .select({ __v: 0, description: 0 })
      .lean()

    if (!products.length) {
      throw new Error('No products found.')
    }
    return products
  } catch (error) {
    console.error('Failed to retrieve product details:', error)
    throw error
  }
}

const createSkincareForm = async (req: Request, res: Response) => {
  try {
    const formData = req.body
    const { aiRecommendationIds, additionalData, reasoning } =
      await callAIRecommendationAPI(formData)

    const productsDetails = await getProductsDetails(aiRecommendationIds)

    const skincareForm = new SkincareFormModel({
      user: req.jwtDecoded.id,
      ...formData,
      aiRecommendation: aiRecommendationIds,
      additionalData: additionalData,
      reasoning: reasoning,
    })

    const savedSkincareForm = await skincareForm.save()
    console.log(savedSkincareForm)

    return res.status(201).json({
      message: 'Skincare form created successfully, recommendation received',
      data: savedSkincareForm,
      products: productsDetails,
    })
  } catch (error) {
    console.error('Failed to create Skincare form:', error)
    return res.status(500).json({
      error: 'Could not create Skincare form or get recommendations',
    })
  }
}

const getSkincareFormData = async (req, res) => {
  try {
    const SkincareFormData = await SkincareFormModel.find({
      user: req.jwtDecoded.id,
    }).select('-__v')
    return res.status(200).json({
      message: 'Lấy biểu mẫu làm đẹp thành công',
      data: SkincareFormData,
    })
  } catch (error) {
    console.error('Failed to retrieve Skincare form data:', error)
    return res.status(500).json({ error: error.message })
  }
}
const getSkincareFormById = async (req, res) => {
  try {
    const skincareFormData: any = await SkincareFormModel.findById(
      req.params.skincare_id
    ).select('-__v')
    const productsDetails = await getProductsDetails(
      skincareFormData.aiRecommendation
    )
    return res.status(200).json({
      message: 'Lấy chu trình skincare thành công',
      data: skincareFormData,
      products: productsDetails,
    })
  } catch (error) {
    console.error('Failed to retrieve skincare form data:', error)
    return res.status(500).json({ error: error.message })
  }
}
const SkincareController = {
  createSkincareForm,
  getSkincareFormData,
  getSkincareFormById,
}

export default SkincareController
