import Head from 'expo-router/head';
import { Text } from 'react-native';

export default function Page() {
  return (
    <>
      <Head>
        <title>LiveLinkME</title>
        <meta name="description" content="Chat and make real and lasting 1V1 connections!" />
        
        {/* Open Graph Meta Tags for Rich Previews */}
        <meta property="og:title" content="LiveLinkME" />
        <meta property="og:description" content="Chat and make real and lasting 1V1 connections!" />
        <meta property="og:image" content="https://raw.githubusercontent.com/d-willie01/blindDate/refs/heads/main/frontend/assets/images/logo.png" />
        <meta property="og:url" content="https://livelinkme.com" />
        <meta property="og:type" content="website" />
        
        {/* Favicon */}
        <link rel="icon" href="https://raw.githubusercontent.com/d-willie01/blindDate/refs/heads/main/frontend/assets/images/logo.png" />
      </Head>
      
      <Text>About LiveLinkME</Text>
    </>
  );
}

