import { IFeatureError, RESPONSE_CODE } from "~/types"
import FeatureError from "./FeatureError"
import { Response } from "express"

const errorHandler = (res: Response<IFeatureError>, error: unknown) => {
  if (error instanceof FeatureError) {
    res.status(error.serverStatus).send({
      status: "error",
      code: error.code,
      message: error.message,
    })
  } else {
    res.status(500).send({
      status: "error",
      code: RESPONSE_CODE.UNKNOWN_ERROR,
      message: error,
    })
    throw error
  }
}

export default errorHandler
