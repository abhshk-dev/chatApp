import 'unicode-emoji-picker';
import {useRef,useEffect} from "react"

export default function EmojiMenu({isSelfMessage}){
    
    const emojiPicker= useRef(null);
    
    useEffect(()=>{
        emojiPicker.current?.addEventListener('emoji-pick',(e)=>{
            console.log(e.detail.emoji)
        })
    },[])

    return (
    <div className={`absolute z-50  top-full translate-y-2 ${isSelfMessage ? "left-0":"right-0"}`} >
        <unicode-emoji-picker ref={emojiPicker} ></unicode-emoji-picker>
    </div>
    )
}