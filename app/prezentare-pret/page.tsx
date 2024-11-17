'use client';

import { useState } from 'react';
import styles from './page.module.css';
import PricePresProtectedPage from '../components/PricePresProtectedPage';

function PresentationPage() {
  const [isSplitView, setIsSplitView] = useState(false);

  return (
    <PricePresProtectedPage>
      <div className={styles.container}>
        <button 
          className={styles.toggleButton}
          onClick={() => setIsSplitView(!isSplitView)}
        >
          {isSplitView ? 'SINGLE VIEW' : 'SPLIT VIEW'}
        </button>
        
        <div className={`${styles.pdfContainer} ${isSplitView ? styles.split : ''}`}>
          <div className={styles.pdfFrame}>
            <iframe
              src="/presentation.pdf"
              className={styles.pdfViewer}
            />
          </div>
          
          {isSplitView && (
            <div className={styles.pdfFrame}>
              <iframe
                src="/explanation.pdf"
                className={styles.pdfViewer}
              />
            </div>
          )}
        </div>
      </div>
    </PricePresProtectedPage>
  );
}

export default PresentationPage;