/*this program is written for the benefit of the society*/
/* Always attribute this text as part of the license */
/* released under MIT opensource license*/
/* developed by: @Victor Mark */
/* You can add your name here if you improve code functionality*/
/*https://github.com/Tylique*/

"use client";
import { useState, useRef, useEffect } from 'react';
import EmailPreview from '@/components/EmailPreview';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import type { PetitionTopic } from '@/lib/types'; 
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function Home() {
  const [topics, setTopics] = useState<PetitionTopic[]>([]);
  const [email, setEmail] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [userDetails, setUserDetails] = useState({
    name: '',
    location: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingTopics, setIsLoadingTopics] = useState(true);
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    const loadTopics = async () => {
      try {
        const response = await fetch('/api/topics');
        if (!response.ok) throw new Error('Failed to load topics');
        const data = await response.json();
        setTopics(data);
      } catch (error) {
        console.error('Error loading topics:', error);
        // Fallback to local topics
        const localTopics = await import('@/lib/approved-topics.json');
        setTopics(localTopics.default || localTopics);
      } finally {
        setIsLoadingTopics(false);
      }
    };
    loadTopics();
  }, []);

  const generateEmail = async () => {
    if (!selectedTopic) return;

    setIsGenerating(true);
    try {
      const topic = topics.find(t => t.id === selectedTopic);
      if (!topic) throw new Error('Topic not found');

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, userDetails }),
      });

      if (!res.ok) throw new Error('Failed to generate');
      const { email } = await res.json();
      setEmail(email);
    } catch (error) {
      console.error('Generation error:', error);
      alert('Failed to generate email. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const currentTopic = topics.find(t => t.id === selectedTopic);

  if (isLoadingTopics) {
    return (
      <div className="card border-0 shadow-sm animate-fade-in">
        <div className="card-body p-4 text-center">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading topics...</span>
          </div>
          <p className="mt-2">Loading petition topics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm animate-fade-in">
      <div className="card-body p-4">
        <header className="text-center mb-4">
          <div className="text-center mt-4 pt-3 ">
            <a href="/bill" className="btn btn-outline-success btn-sm">
              <i className="bi bi-plus-circle me-1"></i>
              Finance Bill Summary
            </a>
          </div>
          <h1 className="h3 text-success mb-2">Kenyan Email Petitions</h1>
          <p className="text-muted">Create effective petitions in minutes</p>
        </header>

        <div className="row g-3">
          <div className="col-12">
            <label className="form-label fw-bold mb-3">Swipe to Select Topic*</label>

            {/* Swiper component for topic cards */}
            <Swiper
              ref={swiperRef}
              modules={[Navigation, Pagination]}
              spaceBetween={20}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              breakpoints={{
                576: { slidesPerView: 2 },
                992: { slidesPerView: 3 }
              }}
              onSlideChange={(swiper) => {
                const activeIndex = swiper.activeIndex;
                setSelectedTopic(topics[activeIndex]?.id || '');
              }}
              className="mb-4"
            >
              {topics.map((topic) => (
                <SwiperSlide key={topic.id}>
                  <div
                    className={`card h-100 cursor-pointer ${selectedTopic === topic.id ? 'border-success' : ''}`}
                    onClick={() => {
                      setSelectedTopic(topic.id);
                      const index = topics.findIndex(t => t.id === topic.id);
                      swiperRef.current?.swiper.slideTo(index);
                    }}
                  >
                    <div className="card-body">
                      <h5 className="card-title text-success">{topic.title}</h5>
                      <p className="card-text small text-muted">{topic.description}</p>
                      <div className="mt-auto pt-2">
                        <small className="text-muted">
                          <strong>Recipients:</strong> {topic.recipients.join(', ')}
                        </small>
                      </div>
                    </div>
                    <div className="card-footer bg-transparent">
                      <button
                        className={`btn btn-sm ${selectedTopic === topic.id ? 'btn-success' : 'btn-outline-success'}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTopic(topic.id);
                          generateEmail();
                        }}
                      >
                        Select
                      </button>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Rest of your form remains the same */}
          <div className="col-md-6">
            <label className="form-label">Your Name (Optional)</label>
            <input
              type="text"
              value={userDetails.name}
              onChange={(e) => setUserDetails({...userDetails, name: e.target.value})}
              className="form-control form-control-lg"
              placeholder="John Doe"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Your Location (Optional)</label>
            <input
              type="text"
              value={userDetails.location}
              onChange={(e) => setUserDetails({...userDetails, location: e.target.value})}
              className="form-control form-control-lg"
              placeholder="Nairobi"
            />
          </div>

          <div className="col-12 mt-3">
            <button
              onClick={generateEmail}
              disabled={!selectedTopic || isGenerating}
              className="btn btn-success w-100"
            >
              {isGenerating ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Generating...
                </>
              ) : 'Generate Petition Email'}
            </button>
          </div>
        </div>

        {email && (
          <div className="mt-4">
            <EmailPreview
              email={email}
              currentTopic={currentTopic}
            />
          </div>
        )}

        <div className="text-center mt-4 pt-3 border-top">
          <a href="/submit" className="btn btn-outline-success btn-sm">
            <i className="bi bi-plus-circle me-1"></i>
            Suggest New Topic
          </a>
        </div>
      </div>
    </div>
  );
}
