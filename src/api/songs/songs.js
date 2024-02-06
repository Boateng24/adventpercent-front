import { songBase } from "../backend.api"
import axios from "axios"

const recommendedSongs = async (page) => {
  try {
    const response = await axios.get(`${songBase}/recommended?page=${page}`);
    return response.data?.data?.recommended
  } catch (error) {
    console.log(error)
  }
}

const getSongById = async (id) => {
    try {
        const response = await axios.get(`${songBase}/song/${id}`)
        return response.data?.song
    } catch (error) {
       console.log(error) 
    }
}

const trendingSongs = async () => {
  try {
    const response = await axios.get(`${songBase}/trendings`)
    return response.data?.trendingSongs
  } catch (error) {
    console.log(error)
  }
}


export default {recommendedSongs, getSongById, trendingSongs};