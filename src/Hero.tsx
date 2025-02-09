import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

interface BannerImage {
    title: string;
    image: string;  // 现在这个就是完整的URL了
    link: string;
    order: number;
}

const Hero: React.FC = () => {
    const [banners, setBanners] = useState<BannerImage[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                console.log('开始获取banner数据...');
                setLoading(true);
                
                const bannersQuery = query(
                    collection(db, 'banners'),
                    where('active', '==', true),
                    orderBy('order', 'asc')
                );
                
                const snapshot = await getDocs(bannersQuery);
                
                const now = new Date();
                const bannerData = snapshot.docs
                    .map(doc => {
                        const data = doc.data();
                        // 检查日期
                        if (data.startDate && data.endDate) {
                            const startDate = data.startDate.toDate();
                            const endDate = data.endDate.toDate();
                            if (startDate > now || endDate < now) {
                                return null;
                            }
                        }
                        
                        return {
                            title: data.title,
                            image: data.image, // 直接使用存储的URL
                            link: data.link,
                            order: data.order
                        };
                    })
                    .filter((banner): banner is BannerImage => banner !== null);
                
                console.log('获取到的banner数据:', bannerData);
                setBanners(bannerData);
            } catch (error) {
                console.error('获取banner错误:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBanners();
    }, []);

    // ... 其余代码保持不变 ...
};

export default Hero; 