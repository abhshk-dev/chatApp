import 'unicode-emoji-picker';

export default function EmojiMenu({isSelfMessage}){
    return (

    <div className={`absolute z-50  top-full translate-y-2 ${isSelfMessage ? "left-0":"right-0"}`} >
        <unicode-emoji-picker filtersPosition="top"></unicode-emoji-picker>
    </div>
    )
}