/**
 * Gallery
 */
import React, { Component } from 'react';

// api
import api from 'Api';

// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';

// intl messages
import IntlMessages from 'Util/IntlMessages';

class Gallery extends Component {

	state = {
		galleryImages: null
	}

	componentDidMount() {
		this.getGalleryImages();
	}

	// get gallery images
	getGalleryImages() {
		api.get('galleryImages.js')
			.then((response) => {
				this.setState({ galleryImages: response.data });
			})
			.catch(error => {
				// error handling
			})
	}

	render() {
		const { galleryImages } = this.state;
		return (
			<div className="gallery-wrapper">
				<PageTitleBar title={<IntlMessages id="widgets.gallery" />} match={this.props.match} />
				<div className="row">
					{galleryImages && galleryImages.map((image, key) => (
						<div className="col-sm-6 col-md-4 col-lg-4 col-xl-3" key={key}>
							<figure className="img-wrapper">
								<img src={image.imageUrl} className="img-fluid" alt="gallery 1" />
								<figcaption>
									<h4>{image.caption}</h4>
									<h2>{image.title}</h2>
								</figcaption>
								<a href="javascript:void(0);">&nbsp;</a>
							</figure>
						</div>
					))}
				</div>
			</div>
		);
	}
}

export default Gallery;
