import Footer from "../home/footer";
import products from "./products";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { useNavigate} from 'react-router-dom';
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { useParams } from "react-router-dom";
import '../../css/home.css';

export default function Categories() { 
  const { genre, feature } = useParams();


const elements = genre 
  ? products.filter(p => p.genre === genre)
  : feature
  ? products.filter(p => p.feature === feature)
  : products;

  const navigate = useNavigate();
  const goToEditor = (title) => {
    console.log("Navigation vers:", genre ? genre : feature, "| Produit:", title);
    if (genre) {
      navigate(`/category/${encodeURIComponent(genre)}/${encodeURIComponent(title)}`);
    } else if (feature) {
      navigate(`/feature/${encodeURIComponent(feature)}/${encodeURIComponent(title)}`);
    }
  };

  return (
    <div>
      <Box component="section" className="cardeee" sx={{ display: "flex", flexWrap: "wrap", gap: 2, p: 2,mb:30,mt:10}}>
        {elements.length === 0 ? (
          <Typography variant="h6" color="error">
            Aucun produit trouvé pour {genre || feature}
          </Typography>
        ) : (
          elements.map((cat, index) => (
            <Card
              key={index}
              sx={{ maxWidth: 345 }}
              className="Cardeee"
              onClick={() => goToEditor(cat.title)}
            >
              <CardActionArea>
                <CardMedia component="img" height="140" image={cat.image} alt={cat.title} />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {cat.title}
                  </Typography>
                 {cat.discount > 0 ? (
  <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
    <Typography
      variant="h"
      sx={{ textDecoration: "line-through", color: "grey.600" }}
    >
      ${Number(cat.price).toFixed(2)}TND
    </Typography>

    <Typography variant="h5" fontWeight="bold" color="error">
      {(Number(cat.price) - (Number(cat.price) * Number(cat.discount)) / 100).toFixed(2)}TND
    </Typography>

    <Typography variant="body2" color="success.main">
      -{Number(cat.discount)}%
    </Typography>
  </Box>
) : (
  <Typography variant="h5" fontWeight="bold">
    ${Number(cat.price).toFixed(2)}TND
  </Typography>
)}
                  <Typography variant="body2" color="primary">
                    {cat.genre}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))
        )}
      </Box>

      <Footer />
    </div>
  );
}
