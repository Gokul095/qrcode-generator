import React, { useState } from 'react'
import './QrCode.css'
import { Badge, Button, Col, Container, FormControl, FormGroup, FormLabel, Image, ModalTitle, Nav, Row, Spinner } from 'react-bootstrap'

const QrCode = () => {

  const [img, setImg] = useState('');
  const [loading,setLoading] = useState(false);
  const [qrData,setQrData] = useState("");
  const [qrSize,setQrSize] = useState("");
  const [msg, setMsg] = useState('')
  const [badge, setBadge] = useState('')

  async function generateQR() {
    setLoading(true);
    try{
      if (qrData && qrSize) {
        const url = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(qrData)}`;
        setImg(url);
        setMsg("QR Code Generated Successfully");
        setBadge("success")
      } else {
        setMsg("QR Data and Size are required");
        setBadge("danger");
        // console.error("QR Data and Size are required");
      }
    }catch(err){
      console.error("Error Generating QR Code", err)
      setMsg("Error Generating QR Code");
      setBadge("danger");
    }finally{
      setLoading(false)
    };
  };

  function downloadQR() {
    if (img) {
      fetch(img)
        .then((response) => response.blob())
        .then((blob) => {
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = "Qrcode.png";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setMsg("QR Code Downloaded Successfully");
          setBadge("success");
        })
        .catch((err) => {
          console.error("Error Downloading QR Code", err);
        });
    } else {
      // console.error("No QR Code to download");
      setMsg("No QR Code to download")
      setBadge("danger");
    }
  };


  return (
    <div className='app-container'>
      <Container>
        <Row>
          <ModalTitle className='text-center pb-4'>QR Code Generator</ModalTitle>
          <Col md={5} xs={12} className='text-center'>
            {loading && <ModalTitle as='p' className='text-center pb-4'> <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                /> Please Wait...</ModalTitle>}
            {img && <Image src={img} className='qr-code-image' />}
          </Col>
          <Col md={7} xs={12}>

              <FormGroup className='pb-4'>
              <FormLabel htmlFor='dataInput'>Data For Qr Code</FormLabel>
              <FormControl type='text' id='dataInput' placeholder='Enter data for QR Code' value={qrData} onChange={(e) => setQrData(e.target.value)} required></FormControl>
              </FormGroup>
              <FormGroup className='pb-4'>
              <FormLabel htmlFor='sizeInput'>Image Size (eb., 150) :</FormLabel>
              <FormControl type='text' id='sizeInput' placeholder='Enter Image Size' value={qrSize} onChange={(e) => setQrSize(e.target.value)}required></FormControl>
              </FormGroup>
              <FormGroup className='mb-4'>
              <Button className='generate-btn' disabled={loading} onClick={generateQR}>
              {loading &&
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              } Generate QR Code
              </Button>
              <Button className='download-btn ms-3' onClick={downloadQR}>Download QR Code</Button>
              </FormGroup>
              <Badge bg={badge} className='mb-4'>{msg}</Badge>

          </Col>
          <ModalTitle as="p" className='text-center'> Designed by <Nav.Link href='https://gokulsaran-portfolio.netlify.app/' style={{display:'inline-block', color:'#712cf9'}}> Gokul Saran </Nav.Link></ModalTitle>
        </Row>
      </Container>
    </div>
  )
}

export default QrCode