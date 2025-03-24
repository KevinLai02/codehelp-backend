import {
  save,
  getInfo,
  getList,
  updateMentorAvailableTime,
} from "./mentor.feature"
import { IApi } from "~/types"
import errorHandler from "~/utils/errorHandler"

export const signUp: IApi = async (req, res) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] }
    const { avatar } = files

    const { newMentor, token } = await save({
      ...req.body,
      avatar,
    })

    return res.status(200).send({
      newMentor,
      status: "ok",
      message: `${newMentor.userName} sign up successful!`,
      token,
    })
  } catch (error) {
    errorHandler(res, error)
  }
}

export const getMentorInfo: IApi = async (req, res) => {
  try {
    const { id } = req.params
    const mentor = await getInfo({ id })

    return res.status(200).send({
      status: "ok",
      mentor,
    })
  } catch (error) {
    errorHandler(res, error)
  }
}

export const getMentorList: IApi = async (req, res) => {
  try {
    const { page, count, keyword } = req.query

    const { mentorList, total } = await getList({
      page: Number(page),
      count: Number(count),
      keyword: keyword?.toString(),
    })

    return res.status(200).send({
      status: "ok",
      mentorList,
      total,
    })
  } catch (error) {
    errorHandler(res, error)
  }
}

export const modifyAvailableTime: IApi = async (req, res) => {
  try {
    const { userId, availableTimeList } = req.body

    const result = await updateMentorAvailableTime({
      mentorId: userId,
      availableTimeList,
    })

    res.status(200).send({
      status: "ok",
      message: "Update successfully",
    })
  } catch (error) {
    errorHandler(res, error)
  }
}
