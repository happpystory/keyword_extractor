import { useState } from 'react';
import { Container, Box } from '@chakra-ui/react';
import Header from './components/Header';
import Footer from './components/Footer';
import Textinput from './components/Textinput';
import KeywordsModal from './components/KeywordsModal';

const App = () => {
  const [keywords, setKeywords] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const extractKeywords = async (text) => { 
    setLoading(true);
    setIsOpen(true);
    
    const options = { 
      method: "POST",
      headers: { 
        'Content-type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        prompt: 'Extract keywords from this text. Make the first letter of each word uppercase and separate with commas\n\n' + text + "",
        temperature: 0.5,
        max_tokens: 20,
        frequency_penalty: 0.8,
        top_p: 1.0,
        presence_penalty: 0.0,
      })
    }

    try {
      const response = await fetch(
        import.meta.env.VITE_OPENAI_API_URL,
        options
      );
      const json = await response.json();
      setKeywords(json.choices[0].text.trim());
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }

  const closeModal = () => {
    setIsOpen(false)
  }

  return (
    <Box bg='blue.600' color='white' height='100vh' paddingTop={130}>
      <Container maxW='3xl' centerContent>
        <Header />
        <Textinput extractKeywords={extractKeywords} />
        <Footer />
      </Container>
      <KeywordsModal keywords={keywords} loading={loading} isOpen={isOpen} closeModal={closeModal} />
    </Box>
  )
}

export default App