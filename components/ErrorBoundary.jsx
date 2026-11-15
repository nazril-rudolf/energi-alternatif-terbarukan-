
import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { err: null }

  /** @param {Error} err */
  static getDerivedStateFromError(err) {
    return { err }
  }

  render() {
    if (this.state.err) {
      return (
        <div className="errbox">
          <h2>Tampilan 3D tidak dapat dimuat</h2>
          <p>
            Perangkat atau browser mungkin tidak mendukung WebGL.
            Coba kualitas LOW atau muat ulang halaman.
          </p>
          <button
            className="btn"
            onClick={() => window.location.reload()}
          >
            Muat ulang
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
