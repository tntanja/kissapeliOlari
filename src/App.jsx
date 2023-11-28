import './App.css';
import Card from './components/Card';
import PlayButton from './components/PlayButton';

import { useState } from 'react';


// Arpoo satunnaisluvun
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);


//luodaan kortti, eli tehdää tämä, jotta pystytään luomaan korttipakka
const kortti= (index) => ({
    image: 'http://placekitten.com/120/100?image=' + index,
    ominaisuudet: [
        {name: 'cuteness', value: getRandomInt(3, 20)},
        {name: 'loving', value: getRandomInt(10, 200)},
        {name: 'speed', value: getRandomInt(1, 220)},
    ],
    // Luodaan id, koska React vaatii korttipakkalistaan key-propin
    id: crypto.randomUUID(),
  });

function shuffle(array) {
    // Fisher-Yates shuffle
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}  

const testikortti = kortti(4);

//tehdään korttipakka
const korttipakka = Array(16).fill(null).map((_, index) => kortti(index));

console.log(korttipakka);

//Jaetaan korttipakka puoliksi tai itseasiassa etsitään sen puolivälin paikka
const puolivali = Math.ceil(korttipakka.length / 2);

function jaaKortit() {
    shuffle(korttipakka);
    return {
      pelaaja: korttipakka.slice(0, puolivali),
      vastustaja: korttipakka.slice(puolivali),
    };
  }

//console.log(jaaKortit())

// Arpoo satunnaiskuvat: Math.floor(Math.random() * (max - min + 1) + min);
// const kissakuvaP = Math.floor(Math.random() * (8 - 0 + 1) + 0);
// const pelaajankortti = {
//     image: 'http://placekitten.com/120/100?image=' + kissakuvaP,
//     ominaisuudet: [
//         {name: 'cuteness', value: getRandomInt(3, 20)},
//         {name: 'loving', value: getRandomInt(10, 200)},
//         {name: 'speed', value: getRandomInt(1, 220)},
//     ],
// };

// const kissakuvaV = Math.floor(Math.random() * (16 - 9 + 1) + 9);
// const vastustajankortti = {
//     image: 'http://placekitten.com/120/100?image=' + kissakuvaV,
//     ominaisuudet: [
//         {name: 'cuteness', value: getRandomInt(3, 20)},
//         {name: 'loving', value: getRandomInt(10, 200)},
//         {name: 'speed', value: getRandomInt(1, 220)},
//     ],
// };


export default function App(){
    const [result, setResult] = useState('');
    const [kortit, setCards] = useState(jaaKortit);
    const [gameState, setGameState] = useState('play');
    const [valittuOminaisuus, setSelected] = useState(0);

    if (gameState === 'play' && !kortit.pelaaja.length || !kortit.vastustaja.length) {
        setGameState('gameOver');
    }

    function compareCards() {
        // molempien korttien ensimmäinen status
        const pelaajanStatus = kortit.pelaaja[0].ominaisuudet[0];
        const vastustajanStatus = kortit.vastustaja[0].ominaisuudet[0];

        // tulos
        // let result = '';

        // verrataan tuloksia
        if (pelaajanStatus.value === vastustajanStatus.value) setResult('tasapeli');
        else if (pelaajanStatus.value > vastustajanStatus.value) setResult('voitto');
        else setResult('häviö');

        console.log(result);
        //setResult(result);
        setGameState('result');
    }

    function nextRound() {
        setCards (kortit => {
            // tallennetaan pelaajien ensimmäiset kortit / pelatut kortit
            const pelatutKortit = [{...kortit.pelaaja[0]}, {...kortit.vastustaja[0]}];

            // luodaan kopiot pelaajien korteista ilman ensimmäistä pelattua korttia
            const pelaaja = kortit.pelaaja.slice(1);
            const vastustaja = kortit.vastustaja.slice(1);

            // vertaillaan tuloksia -> korttien siirtyminen voittajalle
            if (result === 'tasapeli') {
                // pelaajien pelatut kortit poistuu korttipakasta
                return {
                    pelaaja,
                    vastustaja
                };
            }

            if (result === 'voitto'){
                // pelaaja saa pelatut kortit omaan korttipakkaansa
                return {
                    pelaaja: [...pelaaja, ...pelatutKortit],
                    vastustaja
                };
            }

            if (result === 'häviö') {
                // vastustaja saa kaikki pelatut kortit
                return {
                    pelaaja,
                    vastustaja: [...vastustaja, ...pelatutKortit]
                };
            }

            // ei mikään ylemmästä
            return kortit;
        });
        
        setGameState('play');
        setResult('');
    }

    return (
        <>
            <h1> Kissapeli </h1>

            {gameState === 'gameOver' && (
                <div>
                    <h2> Game Over! </h2>
                </div>
            )}

            <div className='pelialue'>

                <div className='hand'>
                    <p> Pelaajan kortti </p>
                    <ul className='korttirivi'>
                    {kortit.pelaaja.map((pelaajanKortti, index) => (
                        <li className='korttirivin-kortti pelaaja' key={pelaajanKortti.id}>
                            <Card 
                                card={index === 0 ? pelaajanKortti : null} 
                                handleSelect = {statIndex => setSelected(statIndex)}
                            />
                        </li>
                    ))}
                    </ul>
                </div>

                <div className="nappi-alue">
                    <p> { result || 'Press the button'} </p>
                    {gameState === 'play' ? (
                        <PlayButton text={'Play'} handleClick={compareCards} />
                    ) : (
                        <PlayButton text={'Next'} handleClick={nextRound} />
                    )}
                    
                </div>

                <div className='hand'>
                    <p> Vastustajan kortti </p>
                    <ul className='korttirivi vastustaja'>
                    {kortit.vastustaja.map((vastustajanKortti, index)=> (
                        <li className='korttirivin-kortti vastustaja' key={vastustajanKortti.id}>
                            <Card card={index === 0 ? vastustajanKortti : null}/>
                        </li>
                    ))}
                    </ul>
                </div>

            </div>
        </>
    );
}