import Image from "next/image";
import { useRouter } from 'next/router';

export default function Home() {
  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}> <h2 style={{ marginTop: '60px' }}>Welcome to the Financial Literacy Website</h2>
    </div> 
  );
}
