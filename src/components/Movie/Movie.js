import React, { Component } from "react";
import Navigation from "../elements/Navigation/Navigation";
import MovieInfo from "../elements/MovieInfo/MovieInfo";
import MovieInfoBar from "../elements/MovieInfoBar/MovieInfoBar";
import FourColGrid from "../elements/FourColGrid/FourColGrid";
import Actor from "../elements/Actor/Actor";
import Spinner from "../elements/Spinner/Spinner";

import * as Config from "../../config";

import "./Movie.css";

class Movie extends Component {
    state = {
        movie: null,
        actors: null,
        directors: [],
        loading: false
    };

    componentDidMount() {
        if (localStorage.getItem(`${this.props.match.params.movieId}`)) {
            const state = JSON.parse(
                localStorage.getItem(`${this.props.match.params.movieId}`)
            );
            this.setState({ ...state });
        } else {
            this.setState({ loading: true });
            //first fetch movie
            const movieId = this.props.match.params.movieId;
            const endPoint = `${Config.API_URL}movie/${movieId}?api_key=${
                Config.API_KEY
            }&language=en-US`;

            this.fetchItems(endPoint);
        }
    }

    fetchItems = async endPoint => {
        try {
            const result = await (await fetch(endPoint)).json();

            if (result.status_code) {
                this.setState({ loading: false });
            } else {
                this.setState({ movie: result });
                //fetch actors in callback of setState
                const movieId = this.props.match.params.movieId;
                const creditEndPoint = `${
                    Config.API_URL
                }movie/${movieId}/credits?api_key=${Config.API_KEY}`;

                const creditsResult = await (await fetch(
                    creditEndPoint
                )).json();
                const directors = creditsResult.crew.filter(
                    member => member.job === "Director"
                );

                this.setState(
                    {
                        actors: creditsResult.cast,
                        directors: directors,
                        loading: false
                    },
                    () => {
                        localStorage.setItem(
                            `${this.props.match.params.movieId}`,
                            JSON.stringify(this.state)
                        );
                    }
                );
            }
        } catch (e) {
            console.log("some error:", e);
        }
    };

    render() {
        return (
            <div className="rmdb-movie">
                {this.state.movie ? (
                    <div>
                        <Navigation movie={this.props.location.movieName} />
                        <MovieInfo
                            movie={this.state.movie}
                            directors={this.state.directors}
                        />
                        <MovieInfoBar
                            time={this.state.movie.runtime}
                            budget={this.state.movie.budget}
                            revenue={this.state.movie.revenue}
                        />
                    </div>
                ) : null}
                {this.state.actors ? (
                    <div className="rmdb-movie-grid">
                        <FourColGrid header={"Actors"}>
                            {this.state.actors.map((element, i) => {
                                return <Actor key={i} actor={element} />;
                            })}
                        </FourColGrid>
                    </div>
                ) : null}
                {!this.state.actors && !this.state.loading ? (
                    <h1>No Movie Found!</h1>
                ) : null}
                {this.state.loading ? <Spinner /> : null}
            </div>
        );
    }
}

export default Movie;
