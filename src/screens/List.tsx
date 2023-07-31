import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';

type dimension = {
  width: number;
  height: number;
};

const {width, height}: dimension = Dimensions.get('screen');

type cardItem = {
  mediaId: string;
  description: string;
  date_news: string;
  authorName: string;
};

export default function List(): React.JSX.Element {
  const [data, setData] = useState([]);

  function fromNow(date: string): string | undefined {
    const SECOND = 1000;
    const MINUTE = 60 * SECOND;
    const HOUR = 60 * MINUTE;
    const DAY = 24 * HOUR;
    const WEEK = 7 * DAY;
    const YEAR = 365 * DAY;
    const MONTH = YEAR / 12;
    const units = [
      {
        max: 30 * SECOND,
        divisor: 1,
        past1: 'just now',
        pastN: 'just now',
        future1: 'just now',
        futureN: 'just now',
      },
      {
        max: MINUTE,
        divisor: SECOND,
        past1: 'a second ago',
        pastN: '# seconds ago',
        future1: 'in a second',
        futureN: 'in # seconds',
      },
      {
        max: HOUR,
        divisor: MINUTE,
        past1: 'a minute ago',
        pastN: '# minutes ago',
        future1: 'in a minute',
        futureN: 'in # minutes',
      },
      {
        max: DAY,
        divisor: HOUR,
        past1: 'an hour ago',
        pastN: '# hours ago',
        future1: 'in an hour',
        futureN: 'in # hours',
      },
      {
        max: WEEK,
        divisor: DAY,
        past1: 'yesterday',
        pastN: '# days ago',
        future1: 'tomorrow',
        futureN: 'in # days',
      },
      {
        max: 4 * WEEK,
        divisor: WEEK,
        past1: 'last week',
        pastN: '# weeks ago',
        future1: 'in a week',
        futureN: 'in # weeks',
      },
      {
        max: YEAR,
        divisor: MONTH,
        past1: 'last month',
        pastN: '# months ago',
        future1: 'in a month',
        futureN: 'in # months',
      },
      {
        max: 100 * YEAR,
        divisor: YEAR,
        past1: 'last year',
        pastN: '# years ago',
        future1: 'in a year',
        futureN: 'in # years',
      },
      {
        max: 1000 * YEAR,
        divisor: 100 * YEAR,
        past1: 'last century',
        pastN: '# centuries ago',
        future1: 'in a century',
        futureN: 'in # centuries',
      },
      {
        max: Infinity,
        divisor: 1000 * YEAR,
        past1: 'last millennium',
        pastN: '# millennia ago',
        future1: 'in a millennium',
        futureN: 'in # millennia',
      },
    ];
    const diff =
      Date.now() - (typeof date === 'object' ? date : new Date(date)).getTime();
    const diffAbs = Math.abs(diff);
    for (const unit of units) {
      if (diffAbs < unit.max) {
        const isFuture = diff < 0;
        const x = Math.round(Math.abs(diff) / unit.divisor);
        if (x <= 1) return isFuture ? unit.future1 : unit.past1;
        return (isFuture ? unit.futureN : unit.pastN).replace('#', x);
      }
    }
  }

  useEffect(() => {
    const url = 'https://stagingsite.livelaw.in/dev/h-api/news';
    fetch(url, {
      method: 'GET',
      headers: {
        's-id':
          'CKEY0F1HNJGSZHJFQPYB5HBMJEM79K26YQDJTY0RX7MVPHGHXTKALSTVARSDAYKUGF2Y',
        'Content-Type': 'application/json',
      },
    })
      .then(resp => resp.json())
      .then(data => {
        setData(data.news);
        console.log(data.news[0]);
      })
      .catch(error => console.log(error));
  }, []);

  return (
    <View style={styles.mainContainer}>
      <FlatList
        data={data}
        contentContainerStyle={styles.contentContainer}
        renderItem={({item, index}: {item: cardItem; index: number}) => {
          return (
            <>
              <View style={styles.cardContainer} key={index.toString()}>
                <Image
                  source={{
                    uri: item?.mediaId
                      ? item?.mediaId
                      : 'https://picsum.photos/200/300',
                  }}
                  style={styles.cardImage}
                  resizeMode="cover"
                />

                <Text style={styles.textStyle} numberOfLines={2}>
                  {item?.description
                    ? item?.description
                    : 'Decription is not presentable'}
                </Text>
                <View style={styles.cardDetailContainer}>
                  <View style={styles.optionsContainer}>
                    <Image
                      source={require('../assets/images/profile.png')}
                      style={styles.icon}
                    />
                    <Text style={styles.textStyle}>{item?.authorName}</Text>
                  </View>
                  <View style={styles.optionsContainer}>
                    <Image
                      source={require('../assets/images/clock.png')}
                      style={styles.icon}
                    />
                    <Text style={styles.textStyle}>
                      {fromNow(item?.date_news)}
                    </Text>
                  </View>
                </View>
                <Text style={styles.countryTagText}>India</Text>
              </View>
            </>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  cardContainer: {
    backgroundColor: '#F3F3F3',
    paddingVertical: 8,
    paddingHorizontal: 6,
    marginTop: 12,
    borderRadius: 6,
  },
  cardDetailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  cardImage: {
    width: '100%',
    height: width / 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    marginBottom: 2,
  },
  countryTagText: {
    backgroundColor: '#FFAB40',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    borderRadius: 1,
    position: 'absolute',
    top: width / 20,
  },
  icon: {
    width: 15,
    height: 15,
    marginRight: 4,
  },
  mainContainer: {
    flex: 1,
  },
  optionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textStyle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
  },
});
