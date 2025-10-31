import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

const services = [
  { id: 1, name: 'Классическая стрижка', price: '1500₽', duration: '45 мин', icon: 'Scissors' },
  { id: 2, name: 'Стрижка + Борода', price: '2200₽', duration: '60 мин', icon: 'User' },
  { id: 3, name: 'Королевское бритьё', price: '1800₽', duration: '50 мин', icon: 'Sparkles' },
  { id: 4, name: 'Детская стрижка', price: '1000₽', duration: '30 мин', icon: 'Baby' },
  { id: 5, name: 'Камуфляж седины', price: '1200₽', duration: '40 мин', icon: 'Paintbrush' },
  { id: 6, name: 'Уход за бородой', price: '900₽', duration: '30 мин', icon: 'Heart' },
];

const masters = [
  { id: 1, name: 'Александр Иванов', experience: '8 лет', specialty: 'Классика и fade', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop' },
  { id: 2, name: 'Дмитрий Петров', experience: '5 лет', specialty: 'Борода и бритьё', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop' },
  { id: 3, name: 'Михаил Сидоров', experience: '10 лет', specialty: 'Авторские стрижки', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop' },
];

const timeSlots = ['10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

export default function Index() {
  const [activeSection, setActiveSection] = useState('home');
  const [selectedMaster, setSelectedMaster] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const handleBooking = () => {
    if (!selectedMaster || !selectedService || !selectedDate || !selectedTime) {
      toast.error('Заполните все поля записи');
      return;
    }
    toast.success('Запись успешно создана! Мы свяжемся с вами для подтверждения.');
    setIsBookingOpen(false);
    setSelectedMaster('');
    setSelectedService('');
    setSelectedDate(undefined);
    setSelectedTime('');
  };

  const scrollToSection = (section: string) => {
    setActiveSection(section);
    const element = document.getElementById(section);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Icon name="Scissors" className="text-accent" size={28} />
            <span>БАРБЕРШОП</span>
          </div>
          <div className="hidden md:flex gap-8 items-center">
            {[
              { id: 'home', label: 'Главная' },
              { id: 'services', label: 'Услуги' },
              { id: 'masters', label: 'Мастера' },
              { id: 'contact', label: 'Контакты' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-sm font-medium transition-colors hover:text-accent ${
                  activeSection === item.id ? 'text-accent' : 'text-foreground'
                }`}
              >
                {item.label}
              </button>
            ))}
            <a
              href="/analytics"
              className="text-sm font-medium transition-colors hover:text-accent flex items-center gap-1"
            >
              <Icon name="BarChart3" size={16} />
              Аналитика
            </a>
          </div>
          <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
            <DialogTrigger asChild>
              <Button className="bg-accent hover:bg-accent/90 text-white font-medium">
                Записаться
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl">Онлайн-запись</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Выберите услугу</label>
                  <Select value={selectedService} onValueChange={setSelectedService}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите услугу" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.name}>
                          {service.name} - {service.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Выберите мастера</label>
                  <Select value={selectedMaster} onValueChange={setSelectedMaster}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите мастера" />
                    </SelectTrigger>
                    <SelectContent>
                      {masters.map((master) => (
                        <SelectItem key={master.id} value={master.name}>
                          {master.name} - {master.specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Выберите дату</label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date() || date < new Date(new Date().setHours(0, 0, 0, 0))}
                    className="rounded-md border"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Выберите время</label>
                  <div className="grid grid-cols-5 gap-2">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? 'default' : 'outline'}
                        onClick={() => setSelectedTime(time)}
                        className={selectedTime === time ? 'bg-accent hover:bg-accent/90' : ''}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleBooking}
                  className="w-full bg-accent hover:bg-accent/90 text-white font-medium py-6 text-lg"
                >
                  Записаться
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </nav>

      <section id="home" className="pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
                Мужской стиль <br />
                <span className="text-accent">нового уровня</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Премиальный барбершоп в центре города. Профессиональные мастера, современные техники стрижек и атмосфера для настоящих мужчин.
              </p>
              <div className="flex gap-4">
                <Button
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-white font-medium px-8"
                  onClick={() => setIsBookingOpen(true)}
                >
                  Записаться онлайн
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => scrollToSection('services')}
                >
                  Наши услуги
                </Button>
              </div>
            </div>
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl animate-scale-in">
              <img
                src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&h=800&fit=crop"
                alt="Барбершоп"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Наши услуги</h2>
            <p className="text-muted-foreground text-lg">Полный спектр барберских услуг</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card
                key={service.id}
                className="hover:shadow-xl transition-all duration-300 hover-scale border-2 hover:border-accent"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="p-3 bg-accent/10 rounded-lg">
                      <Icon name={service.icon as any} className="text-accent" size={24} />
                    </div>
                    <span className="text-2xl font-bold text-accent">{service.price}</span>
                  </div>
                  <h3 className="text-xl font-semibold">{service.name}</h3>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Icon name="Clock" size={16} />
                    {service.duration}
                  </p>
                  <Button
                    className="w-full bg-accent hover:bg-accent/90 text-white"
                    onClick={() => {
                      setSelectedService(service.name);
                      setIsBookingOpen(true);
                    }}
                  >
                    Записаться
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="masters" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Наши мастера</h2>
            <p className="text-muted-foreground text-lg">Профессионалы своего дела</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {masters.map((master, index) => (
              <Card
                key={master.id}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 hover-scale"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={master.image}
                    alt={master.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <CardContent className="p-6 space-y-2">
                  <h3 className="text-xl font-semibold">{master.name}</h3>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Icon name="Award" size={16} className="text-accent" />
                    Опыт: {master.experience}
                  </p>
                  <p className="text-sm text-muted-foreground">{master.specialty}</p>
                  <Button
                    className="w-full mt-4 bg-accent hover:bg-accent/90 text-white"
                    onClick={() => {
                      setSelectedMaster(master.name);
                      setIsBookingOpen(true);
                    }}
                  >
                    Записаться к мастеру
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold">Контакты</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Icon name="MapPin" size={24} className="text-accent mt-1" />
                  <div>
                    <p className="font-medium">Адрес</p>
                    <p className="text-primary-foreground/80">г. Москва, ул. Примерная, д. 123</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Icon name="Phone" size={24} className="text-accent mt-1" />
                  <div>
                    <p className="font-medium">Телефон</p>
                    <p className="text-primary-foreground/80">+7 (495) 123-45-67</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Icon name="Clock" size={24} className="text-accent mt-1" />
                  <div>
                    <p className="font-medium">Режим работы</p>
                    <p className="text-primary-foreground/80">Ежедневно с 10:00 до 22:00</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <Card className="bg-card">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-semibold mb-6 text-foreground">Записаться прямо сейчас</h3>
                  <Button
                    size="lg"
                    className="w-full bg-accent hover:bg-accent/90 text-white font-medium py-6 text-lg"
                    onClick={() => setIsBookingOpen(true)}
                  >
                    Онлайн-запись
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 Барбершоп. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}