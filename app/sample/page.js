'use client';

import { useCompletion } from 'ai/react';
import { useState,useEffect } from 'react';

export default function Page() {
    const [questions, setquestions] = useState([])
    const { completion, input, handleInputChange, handleSubmit } = useCompletion({
        streamProtocol: 'data', // optional, this is the default
        api: "/api/suggest-messages"
    });

    useEffect(() => {
        setquestions(completion.split("||"))
    }, [completion])
    

    

    return (
        <form onSubmit={handleSubmit}>
            <input name="prompt" value={input} onChange={handleInputChange} />
            <button type="submit">Submit</button>
         
            <div>
                {questions.length == 0 ?<> sdjbskdvbsdkjv </> :
                    questions.map((question, index)=>{
                        return (

                            <div key={index} >
                            {question}
                        </div>
                        )
                    })
                
                 }
            </div>
        </form>
    );
}