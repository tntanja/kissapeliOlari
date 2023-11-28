
export default function PlayButton({text, handleClick}) {
    return(
        <button onClick={handleClick} className='playButton' type="button">
            {text}
        </button>
    );
}