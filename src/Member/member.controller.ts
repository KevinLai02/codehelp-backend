import { IApi, RESPONSE_CODE } from "~/types"
import FeatureError from "~/utils/FeatureError"
import { getMember, save } from "./member.feature"
import errorHandler from "~/utils/errorHandler"

export const signUp: IApi = async (req, res) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] }
    if (files) {
      const { avatar } = files

      const { newMember, token } = await save({ ...req.body, avatar })

      return res.status(200).send({
        newMember,
        status: "ok",
        message: `${newMember.userName} sign up successful!`,
        token,
      })
    } else {
      res.status(400).send({
        code: RESPONSE_CODE.VALIDATE_ERROR,
        message: "Please upload an avatar",
      })
    }
  } catch (error) {
    errorHandler(res, error)
  }
}

export const getMemberController: IApi = async (req, res) => {
  try {
    const { memberId } = req.params
    const member = await getMember(memberId)

    res.status(200).send({
      status: "ok",
      member,
    })
  } catch (error) {
    errorHandler(res, error)
  }
}
