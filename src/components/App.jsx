import { useState, useEffect} from "react";
import { Searchbar } from './searchbar/searchbar';
import { ImageGallery } from './image_gallery/image-gallery';
import { Button } from './button/button';
import { Loader } from './loader/loader';
import { Modal } from './modal/modal'
import { getImages } from './data';

export const App = () => {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState('');
  const [modalImageAlt, setModalImageAlt] = useState('');
  const [prevQuery, setPrevQuery] = useState('');
  const [prevPage, setPrevPage] = useState(1);


  const openModal = (imageSrc, imageAlt) => {
    setShowModal(true);
    setModalImageSrc(imageSrc);
    setModalImageAlt(imageAlt);
  }

  const closeModal = () => {
    setShowModal(false);
    setModalImageSrc('');
    setModalImageAlt('');
  };


  const changeQuery = (newQuery) => {
    setQuery(`${Date.now()}/${newQuery}`);
    setImages([]);
    setPage(1);
  };

   useEffect(() => {
    if (
      prevQuery !== query || prevPage !== page
    ) 
    {
      setLoading(true);
      const slashIndex = query.indexOf('/');
      const queryWithoutReqId = query.substring(slashIndex + 1);
      console.log(`Http запрос за ${queryWithoutReqId}, і ${page}`);
      async function fetchData() {
        const newImages = await getImages({
          query: queryWithoutReqId,page,
        });
        setLoading(false)
        setImages(prevImages => [...prevImages, ...newImages]);
      }
      fetchData();
    }
    setPrevQuery(query);
    setPrevPage(page);
  }, [query, page, prevQuery, prevPage]);

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1)
  }


  const hasMoreImages = images.length > 11;
  
    return (
      <div>
        <Searchbar changeQuery={changeQuery}/>
        <ImageGallery images={images} openModal={openModal}/>
        {hasMoreImages && <Button handleLoadMore={handleLoadMore}/>}
        {loading && <Loader />}
        {showModal && (
          <Modal imageSrc={modalImageSrc} altText={modalImageAlt} onClose={closeModal} />
        )}
      </div>
    );
}
