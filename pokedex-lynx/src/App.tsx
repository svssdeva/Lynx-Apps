import {useCallback, useEffect, useRef, useState} from '@lynx-js/react'
import './App.css'
import {PokemonCard} from "./components/PokemonCard.js";
import {useNavigate} from "react-router";


export interface Pokemon {
    name: string;
    url: string;
    index: number;
}

export function App() {
    const [offset, setOffset] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [pokemons, setPokemons] = useState<Pokemon[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const hasLoadedOnce = useRef(false);
    const navigate = useNavigate();
    const handleCardClick = (index: number) => {
        navigate(`/pokemon/${index}`);
    };
    const getPokemons = useCallback((offset: number, limit = 20) => {
       if(offset === 0) {
           setIsLoading(true);
       }
        fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`)
            .then(res => res.json())
            .then(data => {
                if (totalCount === 0) {
                    setTotalCount(data.count); // only set once
                }

                const enrichedResults = data.results.map((pokemon: any) => {
                    const match = pokemon.url.match(/\/pokemon\/(\d+)\//);
                    return {
                        ...pokemon,
                        index: match ? parseInt(match[1]) : null,
                    };
                });

                setPokemons(prev => {
                    const existingIndexes = new Set(prev.map(p => p.index));
                    const newUnique = enrichedResults.filter((p: { index: number; }) => !existingIndexes.has(p.index));
                    return [...prev, ...newUnique];
                });
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch Pokemons", err);
                setIsLoading(false);
            }).finally(() => {

        });
    }, [totalCount]);
    useEffect(() => {
        if (!hasLoadedOnce.current) {
            getPokemons(offset); // initial load
            hasLoadedOnce.current = true;
        }
    }, [getPokemons]);

    const addDataToLower = () => {
        console.log("addDataToLower");
        setTimeout(() => {
            setOffset(prev => prev + 20);
            getPokemons(offset);
        }, 1500);
    };
    return (
      <>
        <view>
          <text className="header">Hello Lynx Pokedex</text>
        </view>
          {/*<view>*/}
          {/*    <text>{JSON.stringify(pokemons)}</text>*/}
          {/*</view>*/}
        <list
            scroll-orientation="vertical"
            list-type="waterfall"
            className="scroll-view"
            span-count={1}
            bounces={false}
            lower-threshold-item-count={2}
            bindscrolltolower={(e) => {
                addDataToLower();
            }}
        >
            {isLoading ? <text className="scroll-view_loading">Loading...</text> : (
                pokemons.map((pokemon) => (
                   <list-item bindtap={() => handleCardClick(pokemon.index)} item-key={`${pokemon}-${pokemon.index}`}>
                       <PokemonCard
                           index={pokemon.index}
                           name={pokemon.name}
                       ></PokemonCard>
                   </list-item>
                ))
            )}
        </list>
          {/*<view>*/}
          {/*      <text className="footer">Load More</text>*/}
          {/*</view>*/}
      </>
  )
}
