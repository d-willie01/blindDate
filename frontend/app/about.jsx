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
        <meta property="og:image" content="https://livelinkme.com/assets/assets/images/logo.fa5ccdfd9dc10b147e403bded9b469c2.png" />
        <meta property="og:url" content="https://livelinkme.com" />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:title" content="LiveLinkME" />
        <meta name="twitter:description" content="Chat and make real and lasting 1V1 connections!" />
        <meta name="twitter:image" content="https://livelinkme.com/assets/assets/images/logo.fa5ccdfd9dc10b147e403bded9b469c2.png" />
        <meta name="twitter:card" content="summary_large_image" />
        
        {/* Favicon */}
        <link rel="icon" href="https://livelinkme.com/assets/assets/images/logo.fa5ccdfd9dc10b147e403bded9b469c2.png" />
      </Head>
      
      <Text>About LiveLinkME</Text>
    </>
  );
}


