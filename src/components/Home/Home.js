import React, { Component } from "react";
import * as Config from "../../config";
import HeroImage from "../elements/HeroImage/HeroImage";
import SearchBar from "../elements/SearchBar/SearchBar";
import FourColGrid from "../elements/FourColGrid/FourColGrid";
import MovieThumb from "../elements/MovieThumb/MovieThumb";
import LoadMoreBtn from "../elements/LoadMoreBtn/LoadMoreBtn";
import Spinner from "../elements/Spinner/Spinner";

import "./Home.css";

class Home extends Component {
    state = {
        movies: [],
        heroImage: null,
        loading: false,
        currentPage: 0,
        totalPages: 0,
        searchTerm: ""
    };

    componentDidMount() {
        if (localStorage.getItem("HomeState")) {
            const state = JSON.parse(localStorage.getItem("HomeState"));
            this.setState({ ...state });
        } else {
            this.setState({ loading: true });
            const endPoint = `${Config.API_URL}movie/popular?api_key=${
                Config.API_KEY
            }&language=en-US&page=1`;
            this.fetchItems(endPoint);
        }
    }

    searchItems = searchTerm => {
        let endPoint = "";
        this.setState({
            movies: [],
            loading: true,
            searchTerm: searchTerm
        });

        if (searchTerm === "") {
            endPoint = `${Config.API_URL}movie/popular?api_key=${
                Config.API_KEY
            }&language=en-US&page=1`;
        } else {
            endPoint = `${Config.API_URL}search/movie?api_key=${
                Config.API_KEY
            }&language=en-US&query=${searchTerm}`;
        }

        this.fetchItems(endPoint);
    };

    loadMoreItems = () => {
        let endPoint = "";

        //if loadmore is clicked
        if (this.state.searchTerm === "") {
            endPoint = `${Config.API_URL}movie/popular?api_key=${
                Config.API_KEY
            }&language=en-US&page=${this.state.currentPage + 1}`;
        }
        //when searching is done
        else {
            endPoint = `${Config.API_URL}search/movie?api_key=${
                Config.API_KEY
            }&language=en-US&query=${this.state.searchTerm}&page=${this.state
                .currentPage + 1}`;
        }

        this.fetchItems(endPoint);
    };

    fetchItems = endpoint => {
        fetch(endpoint)
            .then(result => result.json())
            .then(result => {
                console.log(result);
                this.setState(
                    {
                        movies: [...this.state.movies, ...result.results],
                        heroImage: this.state.heroImage || result.results[0],
                        loading: false,
                        currentPage: result.page,
                        totalPages: result.total_pages
                    },
                    () => {
                        if (this.state.searchTerm === "") {
                            localStorage.setItem(
                                "HomeState",
                                JSON.stringify(this.state)
                            );
                        }
                    }
                );
            })
            .catch(error => console.error("Error:", error));
    };

    render() {
        return (
            <div className="rmdb-home">
                {this.state.heroImage ? (
                    <div>
                        <HeroImage
                            image={`${Config.IMAGE_BASE_URL}${
                                Config.BACKDROP_SIZE
                            }${this.state.heroImage.backdrop_path}`}
                            title={this.state.heroImage.original_title}
                            text={this.state.heroImage.overview}
                        />
                        <SearchBar callback={this.searchItems} />
                    </div>
                ) : null}

                <div className="rmdb-home-grid">
                    <FourColGrid
                        header={
                            this.state.searchTerm
                                ? "Search Results"
                                : "Popular Movies"
                        }
                    >
                        {this.state.movies.map((movie, i) => {
                            return (
                                <MovieThumb
                                    key={i}
                                    clickable={true}
                                    image={
                                        movie.poster_path
                                            ? `${Config.IMAGE_BASE_URL}${
                                                  Config.POSTER_SIZE
                                              }${movie.poster_path}`
                                            : "./images/no_image.jpg"
                                    }
                                    movieId={movie.id}
                                    movieName={movie.original_title}
                                />
                            );
                        })}
                    </FourColGrid>
                    {this.state.loading ? <Spinner /> : null}
                    {this.state.currentPage < this.state.totalPages &&
                    !this.state.loading ? (
                        <LoadMoreBtn
                            text="load more"
                            onclick={this.loadMoreItems}
                        />
                    ) : null}
                </div>
            </div>
        );
    }
}

export default Home;
