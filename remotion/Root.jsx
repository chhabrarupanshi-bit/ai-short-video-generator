import React from 'react'
import { Composition } from 'remotion'; // Missing import add kiya
import {RemotionVideo} from './_components/RemotionVideo'

const RemotionRoot = () => {
    return (
        <>
            <Composition
                id="Empty"
                component={RemotionVideo}
                durationInFrames={60}
                fps={30}
                width={1280}
                height={720}
            />
        </>
    )
}

export default RemotionRoot