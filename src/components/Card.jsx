import '../App.css';

export default function Card({card, handleSelect}) {
    if (!card) return <div className="card" />;
    
    return(
        <div className="card">
            <img className="kortinKuva" src={card.image} />
            <ul className="kissalista">
                {card.ominaisuudet.map((listaelementti, index) => (
                    <li className="kissanOminaisuus" onClick={() => handleSelect && handleSelect(index)} key={index}>
                        <span> {listaelementti.name} </span>
                        <span> {listaelementti.value} </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

