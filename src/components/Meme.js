import React from 'react'
import { useState, useEffect } from 'react'
import html2canvas from 'html2canvas';

export default function Meme() {
    const [meme, setMeme] = useState({
            topText: "TOP TEXT",
            bottomText: "BOTTOM TEXT",
            randomImage: "https://i.imgflip.com/2hgfw.jpg"
    });
    const [allMemes, setAllMemes] = useState({});

    useEffect(() => {
        (async () => {
            const res = await fetch("https://api.imgflip.com/get_memes");
            const data = await res.json();
            setAllMemes(data.data.memes);
        })();
    }, []);

    const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];
    const getMemeImage = () => getRandomItem(allMemes).url;
    const updateMemeImage = () => setMeme(prevMeme => ({
            ...prevMeme,
            randomImage: getMemeImage()
    }));

    const handleChange = (event) => {
        const {name, value} = event.target;
        setMeme(prevMeme => ({ ...prevMeme, [name]: value }))
    }

    const saveMeme = () => {
        html2canvas(document.getElementsByClassName("meme").item(0), { useCORS: true })
            .then(canvas => {
                let image = canvas.toDataURL("image/jpeg", .9);
                var element = document.createElement('a');
                element.setAttribute('href', image);
                element.setAttribute(
                    'download',
                    `${meme.topText} ${meme.bottomText} meme.jpg`
                );
                element.click();
                document.body.removeChild(element);
            })
    }

    return (
        <main>
            <div className='form'>
                <input
                    className='meme__input'
                    type="text"
                    placeholder='TOP TEXT'
                    onChange={handleChange}
                    name="topText"
                    value={meme.topText}
                />
                <input
                    className='meme__input'
                    type="text" placeholder='BOTTOM TEXT'
                    onChange={handleChange}
                    name="bottomText"
                    value={meme.bottomText}
                />
                <button onClick={updateMemeImage} className='meme__button'>generate meme</button>
            </div>
            <div className='meme'>
                <img src={meme.randomImage} className='meme__image' />
                <h2 className='meme__text top'>{meme.topText}</h2>
                <h2 className='meme__text bottom'>{meme.bottomText}</h2>
            </div>
            <button onClick={saveMeme} className='meme__button'>save meme</button>
        </main>
    )
}