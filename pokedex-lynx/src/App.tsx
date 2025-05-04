import {useCallback, useEffect, useRef, useState} from '@lynx-js/react'
import './App.css'
import {PokemonCard} from "./components/PokemonCard.js";

export interface Pokemon {
    name: string;
    url: string;
    index: number;
}

export function App() {
    const [offset, setOffset] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [pokemons, setPokemons] = useState<Pokemon[]>([]);
    const [filteredPokemons, setFilteredPokemons] = useState<Pokemon[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const loader = useRef(null);
    const hasLoadedOnce = useRef(false);

    const handleCardClick = (index: number) => {
       // navigate(`/pokemon/${index}`);
    };
    const getPokemons = useCallback((offset: number, limit = 20) => {
        setIsLoading(true);
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
            });
    }, [totalCount]);
    useEffect(() => {
        if (!hasLoadedOnce.current) {
            getPokemons(offset); // initial load
            hasLoadedOnce.current = true;
        }
    }, [getPokemons]);
    // useEffect(() => {
    //     if (offset !== 0) {
    //         getPokemons(offset);
    //     }
    // }, [offset]);
    // useEffect(() => {
    //     const observer = new IntersectionObserver(
    //         entries => {
    //             const first = entries[0];
    //             if (first.isIntersecting && !isLoading) {
    //                 if (hasLoadedOnce.current && (totalCount === null || offset + 20 < totalCount)) {
    //                     setOffset(prev => prev + 20);
    //                 }
    //             }
    //         },
    //         { threshold: 1.0 }
    //     );
    //
    //     const currentLoader = loader.current;
    //     if (currentLoader) observer.observe(currentLoader);
    //
    //     return () => {
    //         if (currentLoader) observer.unobserve(currentLoader);
    //     };
    // }, [isLoading]);

    useEffect(() => {
        if (search.trim()) {
            const filtered = pokemons.filter(p =>
                p.name.toLowerCase().includes(search.toLowerCase())
            );
            setFilteredPokemons(filtered);
        } else {
            setFilteredPokemons(pokemons);
        }
    }, [search, pokemons]);



    return (
      <>
        <view>
          <text>Hello Lynx Pokedex</text>
        </view>
          {/*<view>*/}
          {/*    <text>{JSON.stringify(pokemons)}</text>*/}
          {/*</view>*/}
        <scroll-view scroll-orientation="vertical" className="scroll-view">
            {isLoading ? <text className="scroll-view_loading">Loading...</text> : (
                pokemons.map((pokemon) => (
                    <PokemonCard
                        key={`${pokemon.name}-${pokemon.index}`}
                        index={pokemon.index}
                        name={pokemon.name}
                    ></PokemonCard>
                ))
            )}

        </scroll-view>
      </>
  )
}
