
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, Heart, Award } from 'lucide-react';

const BiographySection = () => {
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
    <section id="biography" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-4">
            My Life Story
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            A journey of love, learning, and leaving a lasting impact on the world through family, education, and service to others.
          </p>
        </div>

        {/* Personal Philosophy */}
        <Card className="mb-16 card-hover">
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-primary flex items-center gap-2">
              <Heart className="h-6 w-6" />
              My Philosophy
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none">
            <p className="text-muted-foreground leading-relaxed">
              "Life is not measured by the number of breaths we take, but by the moments that take our breath away. 
              I believe in the power of kindness, the importance of family, and the lasting impact of education. 
              Every day is an opportunity to make someone's life a little brighter, to learn something new, 
              and to leave the world a little better than we found it."
            </p>
          </CardContent>
        </Card>

        {/* Timeline of Milestones */}
        <div>
          <h3 className="font-serif text-2xl font-bold text-primary mb-8 text-center">
            Life Milestones
          </h3>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary/20 md:transform md:-translate-x-px"></div>
            
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div
                  key={milestone.year}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-primary rounded-full transform -translate-x-1.5 md:-translate-x-1.5 z-10"></div>
                  
                  {/* Content */}
                  <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}>
                    <Card className="card-hover">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <milestone.icon className="h-5 w-5 text-primary" />
                          <span className="font-semibold text-primary">{milestone.year}</span>
                        </div>
                        <h4 className="font-serif text-xl font-semibold mb-2">{milestone.title}</h4>
                        <p className="text-muted-foreground">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="mt-20">
          <h3 className="font-serif text-2xl font-bold text-primary mb-8 text-center">
            Achievements & Recognition
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="card-hover">
              <CardContent className="p-6 text-center">
                <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                <h4 className="font-serif text-lg font-semibold mb-2">Teacher of the Year</h4>
                <p className="text-muted-foreground">Recognized for excellence in education and positive impact on students (1995)</p>
              </CardContent>
            </Card>
            
            <Card className="card-hover">
              <CardContent className="p-6 text-center">
                <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
                <h4 className="font-serif text-lg font-semibold mb-2">Community Service</h4>
                <p className="text-muted-foreground">Volunteered over 1000 hours at local food bank and literacy programs</p>
              </CardContent>
            </Card>
            
            <Card className="card-hover">
              <CardContent className="p-6 text-center">
                <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                <h4 className="font-serif text-lg font-semibold mb-2">Family Legacy</h4>
                <p className="text-muted-foreground">Raised 3 children, blessed with 7 grandchildren, all successful and caring individuals</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BiographySection;
