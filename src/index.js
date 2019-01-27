import PropTypes from "prop-types";
import React, { Component } from "react";
import Lightbox from "react-images";
import Img from "gatsby-image";

class Gallery extends Component {
  constructor() {
    super();

    this.state = {
      lightboxIsOpen: false,
      currentImage: 0,
      imageHeight: 166
    };

    this.galleryRef = React.createRef();
    this.closeLightbox = this.closeLightbox.bind(this);
    this.gotoNext = this.gotoNext.bind(this);
    this.gotoPrevious = this.gotoPrevious.bind(this);
    this.gotoImage = this.gotoImage.bind(this);
    this.handleClickImage = this.handleClickImage.bind(this);
    this.openLightbox = this.openLightbox.bind(this);
  }

  componentDidMount() {
    window.addEventListener("resize", this.setImageHeight.bind(this));
    this.setImageHeight();
  }

  setImageHeight() {
    const width = this.galleryRef.current.clientWidth;
    const amount = Math.floor(width / 250);
    const imageWidth = Math.abs(width / amount);
    this.setState({
      imageHeight: (imageWidth * 2) / 3
    });
  }

  openLightbox(index, event) {
    event.preventDefault();
    this.setState({
      currentImage: index,
      lightboxIsOpen: true
    });
  }
  closeLightbox() {
    this.setState({
      currentImage: 0,
      lightboxIsOpen: false
    });
  }
  gotoPrevious() {
    this.setState({
      currentImage: this.state.currentImage - 1
    });
  }
  gotoNext() {
    this.setState({
      currentImage: this.state.currentImage + 1
    });
  }
  gotoImage(index) {
    this.setState({
      currentImage: index
    });
  }
  handleClickImage() {
    if (this.state.currentImage === this.props.images.length - 1) return;

    this.gotoNext();
  }
  get images() {
    return this.props.images.map(i => i.node.childImageSharp.fluid);
  }
  renderGallery() {
    if (!this.images) return;

    const gallery = this.images.map((obj, i) => {
      return (
        <article key={i}>
          <a href={obj.src} onClick={e => this.openLightbox(i, e)}>
            <Img style={{ height: this.state.imageHeight }} fluid={obj} />
          </a>
        </article>
      );
    });

    return gallery;
  }
  render() {
    return (
      <>
        <Lightbox
          currentImage={this.state.currentImage}
          images={this.images}
          isOpen={this.state.lightboxIsOpen}
          onClickImage={this.handleClickImage}
          onClickNext={this.gotoNext}
          onClickPrev={this.gotoPrevious}
          onClickThumbnail={this.gotoImage}
          onClose={this.closeLightbox}
        />
        <div
          style={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gridGap: this.props.gap
          }}
          ref={this.galleryRef}
        >
          {this.renderGallery()}
        </div>
      </>
    );
  }
}

Gallery.displayName = "Gallery";
Gallery.propTypes = {
  images: PropTypes.array,
  gap: PropTypes.string
};

export default Gallery;
