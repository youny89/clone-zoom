'use client';

import { tokenProvider } from '@/actions/stream.action';
import Loader from '@/components/loader';
import { useUser } from '@clerk/nextjs';
import {
    StreamVideo,
    StreamVideoClient,
  } from '@stream-io/video-react-sdk';
import React, { useEffect, useState } from 'react';
  
const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
  

const StreamVideoProvider = ({children}:{children:React.ReactNode}) => {
    const [videoClient, setVideoClient] = useState<StreamVideoClient>()

    // get current logged in user from clerk.
    const { user, isLoaded } = useUser();

    // we're going to create that stream user directly from our currently logged in clerk user.
    useEffect(()=>{
      if(!user || !isLoaded) return;  
      if(!apiKey) throw new Error('Stream API Key missing.');

      const client = new StreamVideoClient({
        apiKey,
        user: {
          id: user?.id,
          name: user?.username || user?.id,
          image: user?.imageUrl
        },
        tokenProvider:tokenProvider // this will verify that this user in indeed is that usr
      })

      setVideoClient(client);

    },[user, isLoaded])

    if(!videoClient) return <Loader />

    return (
      <StreamVideo client={videoClient}>
        {children}
      </StreamVideo>
    );
  };


export default StreamVideoProvider;