import MailConfig from '../constants/config'
import { UserModel } from '../database/models/user.model'
import nodemailer from 'nodemailer'
import { hashValue } from '../utils/crypt'

interface MailConfig {
  HOST: string
  PORT: number
  USERNAME: string
  PASSWORD: string
  FROM_ADDRESS: string
}

const forgottenPassword = async (
  email: string
): Promise<{ status: number; message: string }> => {
  let data: { status: number; message: string } = {
    status: 404,
    message: 'User not found!',
  }
  const user: any = await UserModel.findOne({ email }).exec() // Type assertion for user

  if (user) {
    const numbers = '0123456789'
    const characters = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM'
    const special = '!@$%&*'
    const lowercaseCharacters = 'qwertyuiopasdfghjklzxcvbnm'
    const uppercaseCharacters = 'QWERTYUIOPASDFGHJKLZXCVBNM'

    const passwordLength = 8 // Độ dài mật khẩu mong muốn
    let newPasswordProgress = ''

    newPasswordProgress += numbers.charAt(
      Math.floor(Math.random() * numbers.length)
    )
    newPasswordProgress += lowercaseCharacters.charAt(
      Math.floor(Math.random() * lowercaseCharacters.length)
    )
    newPasswordProgress += uppercaseCharacters.charAt(
      Math.floor(Math.random() * uppercaseCharacters.length)
    )
    newPasswordProgress += special.charAt(
      Math.floor(Math.random() * special.length)
    )

    const remainingChars = passwordLength - newPasswordProgress.length

    const allCharacters = characters + numbers + special
    for (let i = 0; i < remainingChars; i++) {
      const randomIndex = Math.floor(Math.random() * allCharacters.length)
      newPasswordProgress += allCharacters.charAt(randomIndex)
    }
    const newPassword = newPasswordProgress

    const transporter = nodemailer.createTransport({
      tls: {
        rejectUnauthorized: false,
      },
      host: MailConfig.HOST,
      port: MailConfig.PORT,
      secure: false,
      auth: {
        user: MailConfig.USERNAME,
        pass: MailConfig.PASSWORD,
      },
    })

    const mailOptions = {
      from: MailConfig.FROM_ADDRESS,
      to: user.email, // Đảm bảo rằng user tồn tại trước khi truy cập email
      subject: 'ZYMY COSMETIC - Xác thực tài khoản',
      text: `
              ZYMY COSMETIC

              Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi,

              Chúng tôi xin gửi mật khẩu của bạn là: ${newPassword}
              `,
    }
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending verification email', error)
      } else {
        console.log('Verification email sent', info.response)
      }
    })
    const hashPassword = hashValue(newPassword)
    console.log(newPassword)
    user.password = hashPassword
    await user.save()
    data.status = 200
    data.message = 'Reset password successfully'
  }

  return data
}

export default forgottenPassword
