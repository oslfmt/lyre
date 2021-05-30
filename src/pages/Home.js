import React from 'react';
import axios from 'axios';

function Home() {

  const createStream = () => {
    const options = {
      method: 'POST',
      url: 'https://livepeer.com/api/stream',
      headers: {
        'content-type': 'application/json',
        'authorization': 'Bearer db002af9-23dd-443a-802e-dcc95d61c27d'
      },
      data: {
        name: 'lyre-stream',
        profiles: [
          {
            "name": "720p",
            "bitrate": 2000000,
            "fps": 30,
            "width": 1280,
            "height": 720
          },
          {
            "name": "480p",
            "bitrate": 1000000,
            "fps": 30,
            "width": 854,
            "height": 480
          },
          {
            "name": "360p",
            "bitrate": 500000,
            "fps": 30,
            "width": 640,
            "height": 360
          }
        ]
      }
    }

    axios.request(options)
      .then(res => console.log(res))
      .catch(err => console.error(err));
  }

  return (
    <div className="container">
      <button className="btn btn-primary" onClick={createStream}>Start a stream</button>
        
    </div>
  )
}

export default Home;
