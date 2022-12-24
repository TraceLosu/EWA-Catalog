import ArtCard from '../components/ArtCard'
import { ImageCard, ImageCfg } from '../types/imageTypes';
import { getDocs } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';
import { imageCol, imageBucket } from '../utils/databases';

type Props = {
  images: Array<ImageCard>;
}

export async function getStaticProps() {
  const docs = await getDocs(imageCol);
  const images: Array<ImageCard> = []

  for (const doc of docs.docs) {
    const data = doc.data()
    const imgLink = await getDownloadURL(ref(imageBucket, data.blob));

    images.push({
      artists: data.artists,
      characters: data.characters,
      meta: data.meta,
      link: imgLink,
    })
  }

  return {
    props: {
      images
    },
    revalidate: 86400
  }
}

export default function Home(props: Props) {
  const images = props.images;

  return (
    <div className='min-h-screen w-screen bg-slate-100'>
      <div className='flex flex-wrap gap-4 justify-center'>
        {images.map((imageCard, index) => <ArtCard imgCard={imageCard} key={index}/>)}
      </div>
    </div>
  );
}
