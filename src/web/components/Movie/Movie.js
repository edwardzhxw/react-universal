import React, { PropTypes } from 'react';
import styles from './movie.scss';

const Movie = ({ src }) => (
  <div className={styles.image}>
    <img alt="" src={src} />
  </div>
);

Movie.propTypes = {
  src: PropTypes.string.isRequired
};

export default Movie;
