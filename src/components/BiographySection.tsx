
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, Heart, Award } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface BiographyContent {
  id: string;
  section_type: string;
  title: string;
  content: string;
  order_index: number;
}

const BiographySection = () => {
  const [biographyContent, setBiographyContent] = useState<BiographyContent[]>([]);
  const [achievements, setAchievements] = useState<BiographyContent[]>([]);
  const [declaration, setDeclaration] = useState<BiographyContent[]>([]);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    const { data, error } = await supabase
      .from('biography_content')
      .select('*')
      .eq('is_published', true)
      .order('order_index', { ascending: true });

    if (!error && data) {
      setBiographyContent(data.filter(item => item.section_type === 'biography'));
      setAchievements(data.filter(item => item.section_type === 'achievements'));
      setDeclaration(data.filter(item => item.section_type === 'declaration'));
    }
  };

  const milestones = [
    {
      year: "1950",
      title: "Born in Springfield",
      description: "Born to loving parents who taught me the value of kindness and hard work.",
      icon: Heart
    },
    {
      year: "1972",
      title: "Graduated University",
      description: "Earned a degree in Education, beginning a lifelong journey of learning and teaching.",
      icon: Award
    },
    {
      year: "1975",
      title: "Married My Best Friend",
      description: "Found my soulmate and began building a beautiful family together.",
      icon: Heart
    },
    {
      year: "1980-1985",
      title: "Children Were Born",
      description: "Welcomed three amazing children who became the light of my life.",
      icon: Heart
    },
    {
      year: "1980-2015",
      title: "Teaching Career",
      description: "Dedicated 35 years to educating young minds and making a difference.",
      icon: Award
    },
    {
      year: "2010",
      title: "Became a Grandparent",
      description: "Experienced the joy of grandchildren and the continuation of our family legacy.",
      icon: Heart
    }
  ];

  return (
    <section id="biography" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            My Life Story
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            A journey of love, learning, and leaving a lasting impact on the world through family, education, and service to others.
          </p>
        </div>

        {/* Personal Philosophy */}
        {declaration.length > 0 && (
          <Card className="mb-16 shadow-lg border-slate-200">
            <CardHeader>
              <CardTitle className="font-serif text-2xl text-slate-900 flex items-center gap-2">
                <Heart className="h-6 w-6 text-blue-600" />
                My Philosophy
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none">
              {declaration.map((item) => (
                <div key={item.id} className="mb-6">
                  <h3 className="font-serif text-xl font-semibold text-slate-800 mb-3">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed italic text-lg">
                    "{item.content}"
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Biography Content */}
        {biographyContent.length > 0 && (
          <div className="mb-16">
            <h3 className="font-serif text-2xl font-bold text-slate-900 mb-8 text-center">
              My Journey
            </h3>
            <div className="space-y-6">
              {biographyContent.map((item) => (
                <Card key={item.id} className="shadow-lg border-slate-200">
                  <CardContent className="p-6">
                    <h4 className="font-serif text-xl font-semibold text-slate-800 mb-3">{item.title}</h4>
                    <p className="text-slate-600 leading-relaxed">{item.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Timeline of Milestones */}
        <div className="mb-16">
          <h3 className="font-serif text-2xl font-bold text-slate-900 mb-8 text-center">
            Life Milestones
          </h3>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-blue-200 md:transform md:-translate-x-px"></div>
            
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div
                  key={milestone.year}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-blue-600 rounded-full transform -translate-x-1.5 md:-translate-x-1.5 z-10"></div>
                  
                  {/* Content */}
                  <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}>
                    <Card className="shadow-lg border-slate-200 hover:shadow-xl transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <milestone.icon className="h-5 w-5 text-blue-600" />
                          <span className="font-semibold text-blue-600">{milestone.year}</span>
                        </div>
                        <h4 className="font-serif text-xl font-semibold mb-2 text-slate-800">{milestone.title}</h4>
                        <p className="text-slate-600">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        {achievements.length > 0 && (
          <div className="mt-20">
            <h3 className="font-serif text-2xl font-bold text-slate-900 mb-8 text-center">
              Achievements & Recognition
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement) => (
                <Card key={achievement.id} className="shadow-lg border-slate-200 hover:shadow-xl transition-shadow">
                  <CardContent className="p-6 text-center">
                    <Award className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <h4 className="font-serif text-lg font-semibold mb-2 text-slate-800">{achievement.title}</h4>
                    <p className="text-slate-600">{achievement.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BiographySection;
