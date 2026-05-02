import React from 'react';
import { Rocket, Coins, Clock, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const benefits = [
  {
    icon: <Rocket className="w-10 h-10 text-primary mb-4" />,
    title: "빠른 설치",
    desc: "신청 당일 즉시 설치 가능! 답답한 기다림 없이 빠르게 이용하세요."
  },
  {
    icon: <Coins className="w-10 h-10 text-secondary mb-4" />,
    title: "최대 지원금",
    desc: "업계 최고 수준의 현금 사은품을 약속드립니다. 설치 당일 100% 지급!"
  },
  {
    icon: <ShieldCheck className="w-10 h-10 text-green-500 mb-4" />,
    title: "정식 대리점",
    desc: "방송통신위원회 사전승낙을 받은 믿을 수 있는 공식 가입센터입니다."
  },
  {
    icon: <Clock className="w-10 h-10 text-blue-500 mb-4" />,
    title: "365일 상담",
    desc: "휴일, 주말 상관없이 365일 연중무휴 전문 상담사가 대기중입니다."
  }
];

export function BenefitsSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-gray-900 mb-4">왜 인터넷 사은품을 선택해야 할까요?</h2>
          <p className="text-gray-600 text-lg">10년 이상의 노하우로 고객님께 최고의 혜택을 찾아드립니다.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center flex flex-col items-center"
            >
              <div className="bg-gray-50 p-4 rounded-full mb-4">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {benefit.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
