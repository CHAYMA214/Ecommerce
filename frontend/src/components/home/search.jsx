import { useState, useEffect } from 'react';
import '../../css/home.css';
import { BsSearch } from 'react-icons/bs';
import { Box, Typography, Modal } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import products from '../shop/products';

function Search() {
  const navigate = useNavigate();

  const [searchVal, setSearchVal] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [open, setOpen] = useState(false);

  // ✅ Mettre à jour filteredProducts uniquement quand products change
  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  const handleSearchClick = () => {
    if (!searchVal.trim()) {
      setFilteredProducts(products);
    } else {
      const filterBySearch = products.filter((item) =>
        item.title.toLowerCase().includes(searchVal.toLowerCase())
      );
      setFilteredProducts(filterBySearch);
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const goToEditor = (genre, title) => {
    navigate(`/category/${encodeURIComponent(genre)}/${encodeURIComponent(title)}`);
    setOpen(false);
  };

  const popupStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    maxHeight: 800,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 3,
    overflowY: 'auto',
    borderRadius: 2,
  };

  return (
    <div className="search">
      <div className="gap-3">
        <span className="input-group gap-1">
          <input
            placeholder="Search items ..."
            onChange={(e) => setSearchVal(e.target.value)}
            value={searchVal}
          />
          <BsSearch
            className="mt-1"
            onClick={handleSearchClick}
            style={{ cursor: "pointer", color: "grey" }}
          />
        </span>
      </div>

      <Modal open={open} onClose={handleClose} aria-labelledby="search-results-title">
        <Box sx={popupStyle}>
          <Typography id="search-results-title" variant="h6" mb={2}>
            Search Results
          </Typography>

          {filteredProducts.length === 0 ? (
            <Typography>No items found</Typography>
          ) : (
            filteredProducts.map((product, index) => (
              <Box
                key={index}
                sx={{
                  mb: 2,
                  p: 1,
                  borderBottom: '1px solid #ccc',
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: '#f9f9f9' },
                }}
                onClick={() => goToEditor(product.genre, product.title)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    src={product.image}
                    alt={product.title}
                    style={{ height: 100, width: 100, marginRight: 8 }}
                  />
                  <Typography sx={{ fontWeight: 'bold', marginRight: 'auto', fontSize: '15px' }}>
                    {product.title}
                  </Typography>

                  {product.discount > 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      <Typography
                        variant="body2"
                        sx={{ textDecoration: 'line-through', color: 'grey.600' }}
                      >
                        {Number(product.price).toFixed(2)} TND
                      </Typography>

                      <Typography variant="body1" fontWeight="bold" color="error">
                        {(Number(product.price) - (Number(product.price) * Number(product.discount)) / 100).toFixed(2)} TND
                      </Typography>

                      <Typography variant="caption" color="success.main">
                        -{Number(product.discount)}%
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body1" fontWeight="bold" sx={{ color: 'black' }}>
                      {Number(product.price).toFixed(2)} TND
                    </Typography>
                  )}
                </Box>
              </Box>
            ))
          )}
        </Box>
      </Modal>
    </div>
  );
}

export default Search;
