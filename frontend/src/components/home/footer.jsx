import { Box, Typography } from '@mui/material';
import '../../css/home.css';
import {
  MDBIcon,
  MDBBtn
} from 'mdb-react-ui-kit';

export default function Footer() {
  return (
    <Box component="footer" className="footerhome"sx={{     mt: "auto",     }}>
  <section className="mb-4">  <Typography variant="body2" className="footertitle">
    © {new Date().getFullYear()} MyWebsite. All rights reserved.
  </Typography>
    <div className="icons-form">
      <div className="icons">
      <MDBBtn outline color="light" floating href="mailto:transnoova@gmail.com" role="button">
        <MDBIcon fas icon="envelope" />
      </MDBBtn>
</div>

      <div className="icons">
      <MDBBtn outline color="light" floating href="#!" role="button">
        <MDBIcon fab icon="instagram" />
      </MDBBtn>
</div>
      <div className="icons">
      <MDBBtn outline color="light" floating href="#!" role="button">
        <MDBIcon fab icon="linkedin-in" />
      </MDBBtn>
</div>
      <div className="icons">
      <MDBBtn
        outline
        color="light"
        floating
        href="https://www.facebook.com/people/Transnoova/61579011085603/"
        role="button"
      >
        <MDBIcon fab icon="facebook" />
      </MDBBtn></div>
    </div>
  </section>


</Box>

  );
}
