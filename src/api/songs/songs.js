import { songBase } from "../backend.api"
import axios from "axios"

const recommendedSongs = async () => {
  try {
    const response = await axios.get(`${songBase}/recommended`);
    return response.data.recommended
  } catch (error) {
    console.log(error)
  }
}

const getSongById = async (id) => {
    try {
        const response = await axios.get(`${songBase}/song/${id}`)
        return response.data.song
    } catch (error) {
       console.log(error) 
    }
}


export default {recommendedSongs, getSongById};