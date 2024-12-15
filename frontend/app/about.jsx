import Head from 'expo-router/head';
import { Text } from 'react-native';

export default function Page() {
  return (
    <>
      <Head>
  {/* Title Tag */}
  <title>LiveLinkME - Instant 1V1 Video Chat and Online Connections</title>

  {/* Standard SEO Meta Tags */}
  <meta charset="UTF-8" />
  <meta http-equiv="Content-Language" content="en" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Chat and make real and lasting 1V1 connections on LiveLinkME! Meet new people instantly." />
  <meta name="keywords" content="video chat, 1v1 chat, online connections, live chat, meet new people" />
  <meta name="author" content="LiveLinkME" />

  {/* Open Graph Meta Tags for Rich Previews */}
  <meta property="og:title" content="LiveLinkME - Instant 1V1 Video Chat and Online Connections" />
  <meta property="og:description" content="Chat and make real and lasting 1V1 connections on LiveLinkME! Meet new people instantly." />
  <meta property="og:image" content="https://livelinkme.com/assets/assets/images/logo.fa5ccdfd9dc10b147e403bded9b469c2.png" />
  <meta property="og:url" content="https://livelinkme.com" />
  <meta property="og:type" content="website" />

  {/* Twitter Card Meta Tags */}
  <meta name="twitter:title" content="LiveLinkME - Instant 1V1 Video Chat and Online Connections" />
  <meta name="twitter:description" content="Chat and make real and lasting 1V1 connections on LiveLinkME! Meet new people instantly." />
  <meta name="twitter:image" content="https://livelinkme.com/assets/assets/images/logo.fa5ccdfd9dc10b147e403bded9b469c2.png" />
  <meta name="twitter:card" content="summary_large_image" />

  {/* Favicon */}
  <link rel="icon" href="https://livelinkme.com/assets/assets/images/logo.fa5ccdfd9dc10b147e403bded9b469c2.png" />
</Head>

      
      <Text>About LiveLinkME</Text>
    </>
  );
}


