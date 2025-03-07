import { IApi, RESPONSE_CODE } from "~/types"
import FeatureError from "~/utils/FeatureError"
import { login, getUserInfo } from "./user.feature"

export const loginController: IApi = async (req, res) => {
  try {
    const { email, password } = req.body
    const { identity, user, token } = await login({ email, password })

    return res.status(200).send({
      status: "ok",
      msg: "Login successful",
      identity,
      token,
      user,
    })
  } catch (error) {
    if (error instanceof FeatureError) {
      res.status(error.serverStatus).send({
        code: error.code,
        message: error.message,
      })
    } else {
      res.status(500).send({
        code: RESPONSE_CODE.UNKNOWN_ERROR,
        message: error,
      })
      throw error
    }
  }
}

export const getUserInfoController: IApi = async (req, res) => {
  try {
    const { userId } = req.body
    const { identity, user } = await getUserInfo({ userId })

    return res.status(200).send({
      status: "ok",
      identity,
      user,
    })
  } catch (error) {
    if (error instanceof FeatureError) {
      res.status(error.serverStatus).send({
        code: error.code,
        message: error.message,
      })
    } else {
      res.status(500).send({
        code: RESPONSE_CODE.UNKNOWN_ERROR,
        message: error,
      })
      throw error
    }
  }
}
