import './PokemonCard.css';
interface Props {
    key: string
    index: number
    name: string
}

const getPokeImage = (index: number) => {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index}.png`;
};
export function PokemonCard({index, name, key}: Props) {
    return (
        <view id={`${index}`} className="card">
            <text>{`${index} : ${name}`}</text>
            <image auto-size style="width:100px;" src={getPokeImage(index)} />
        </view>
    )
}