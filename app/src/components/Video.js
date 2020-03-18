import React from 'react'
import ReactPlayer from 'react-player'

const Video = ({ videoMetadata }) => {
  const { thumbnail, all_urls } = videoMetadata
  return (
    <div>
      <ReactPlayer
        width="100%"
        height="100%"
        url="http://www.youtube.com/watch?v=RBSGKlAvoiM"
      />
    </div>
  )
}
export default Video
