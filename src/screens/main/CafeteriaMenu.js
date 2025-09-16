// import React, { useState } from 'react';
// import {
//   View,
//   FlatList,
//   Image,
//   StyleSheet,
// } from 'react-native';
// import {
//   Button,
//   Card,
//   Chip,
//   Text,
//   Title,
//   Provider as PaperProvider,
// } from 'react-native-paper';

// const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
// const CATEGORIES = {
//   breakfast: { label: 'Breakfast', color: '#FF6B35' },
//   lunch: { label: 'Lunch', color: '#4ECDC4' },
//   dessert: { label: 'Dessert', color: '#E17055' },
// };

// // Convert sampleMenus array into an object for easier lookup
// const sampleMenus = [
//   {
//     day: 'Monday',
//     breakfast: [
//       { name: 'Manakish Zaatar', protein: 8, calories: 280, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTc7xbtURhtz8h-eugMxlGImDtRHsREBYMVRQ&s'},
//       { name: 'Labneh with Olive Oil', protein: 10, calories: 200, image: 'https://www.simplyleb.com/wp-content/uploads/labneh_yogurt-3.jpg' }
//     ],
//     lunch: [
//       { name: 'Chicken Tawook Wrap', protein: 25, calories: 450, image: 'https://lebeirut.lk/wp-content/uploads/2024/09/ultimate.jpg' },
//       { name: 'Fattoush Salad', protein: 5, calories: 180, image: 'https://walkingthroughlavenderfields.com/wp-content/uploads/2022/10/fattoush-01.jpeg' }
//     ],
//     dessert: [
//       { name: 'Knafeh', protein: 14, calories: 500, image: 'https://i.pinimg.com/600x315/0a/76/94/0a76948174fd999a0af600c2078cfa66.jpg' }
//     ]
//   },
//   {
//     day: 'Tuesday',
//     breakfast: [
//       {
//         name: 'Manouche Jebne and Zaatar',
//         protein: 15,
//         calories: 500,
//         image: 'https://lamanouchelibanaise.wordpress.com/wp-content/uploads/2019/04/whatsapp-image-2019-04-15-at-13.23.44-2.jpeg'
//       },
//       {
//         name: 'Manouche Jebne Harra',
//         protein: 15,
//         calories: 580,
//         image: 'https://ik.imagekit.io/misterd/tr:w-500,q-90/photo/_3jv0mfjjxi7tqxe_1708511372819_jebne%20harra.png'
//       }
//     ],
//     lunch: [
//       {
//         name: 'Beef Shawarma Sandwich',
//         protein: 30,
//         calories: 500,
//         image: 'https://amiraspantry.com/wp-content/uploads/2020/11/beef-shawarma-recipe-IG.jpg'
//       },
//       {
//         name: 'Tabbouleh Salad',
//         protein: 4,
//         calories: 170,
//         image: 'https://www.icookstuff.com/posts/450/images/0.jpg'
//       }
//     ],
//     dessert: [
//       {
//         name: 'Maamoul Cookies',
//         protein: 3,
//         calories: 150,
//         image: 'https://veredguttman.com/wp-content/uploads/2020/12/Date-maamoul.jpg'
//       }
//     ]
//   },
//   {
//     day: 'Wednesday',
//     breakfast: [
//       {
//         name: 'Croissant',
//         protein: 5,
//         calories: 260,
//         image: 'https://en.julskitchen.com/wp-content/uploads/sites/2/2013/05/Italian-croissants-15.jpg'
//       },
//       {
//         name: 'Pain Au Chocolat',
//         protein: 4,
//         calories: 150,
//         image: 'https://images.immediate.co.uk/production/volatile/sites/30/2024/06/PainAuChoc-0ff983a.jpg'
//       },
//       {
//         name: 'Manouche Jebne',
//         protein: 15,
//         calories: 550,
//         image: 'https://lebanoninapicture.com/pages/good-morning-lebanon-from-kobayat-rodny-s/insta_10-11-2016-8-10-47-am-m.jpg'
//       }
//     ],
//     lunch: [
//       {
//         name: 'Mansaf',
//         protein: 20,
//         calories: 400,
//         image: 'https://butfirstchai.com/wp-content/uploads/2023/06/jordanian-mansaf-recipe.jpg'
//       },
//       {
//         name: 'Fattoush Salad',
//         protein: 5,
//         calories: 180,
//         image: 'https://walkingthroughlavenderfields.com/wp-content/uploads/2022/10/fattoush-01.jpeg'
//       }
//     ],
//     dessert: [
//       {
//         name: 'Maamoul Cookies',
//         protein: 3,
//         calories: 150,
//         image: 'https://veredguttman.com/wp-content/uploads/2020/12/Date-maamoul.jpg'
//       }
//     ]
//   },
//   {
//     day: 'Thursday',
//     breakfast: [
//       {
//         name: 'Waffles with syrup',
//         protein: 12,
//         calories: 300,
//         image: 'https://www.musselmans.com/wp-content/uploads/abwcs-580x435.jpg'
//       },
//       {
//         name: 'Manakish Zaatar',
//         protein: 8,
//         calories: 280,
//         image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTc7xbtURhtz8h-eugMxlGImDtRHsREBYMVRQ&s'
//       },
//       {
//         name: 'Manouche Jebne',
//         protein: 15,
//         calories: 550,
//         image: 'https://lebanoninapicture.com/pages/good-morning-lebanon-from-kobayat-rodny-s/insta_10-11-2016-8-10-47-am-m.jpg'
//       }
//     ],
//     lunch: [
//       {
//         name: 'Chicken Shawarma Sandwich',
//         protein: 25,
//         calories: 450,
//         image: 'https://food.fnr.sndimg.com/content/dam/images/food/fullset/2022/11/08/DV3607-fattoush-chicken-shawarma-wrap-shawarma-guys-san-diego-california_s4x3.JPG.rend.hgtvcom.1280.1280.suffix/1667937205404.webp'
//       },
//       {
//         name: 'Fattoush Salad',
//         protein: 5,
//         calories: 180,
//         image: 'https://walkingthroughlavenderfields.com/wp-content/uploads/2022/10/fattoush-01.jpeg'
//       }
//     ],
//     dessert: [
//       {
//         name: 'Lazy Cake',
//         protein: 4,
//         calories: 320,
//         image: 'https://thecookingfoodie.com/wp-content/uploads/2024/08/240872_d1-jpg.jpg'
//       }
//     ]
//   },
//   {
//     day: 'Friday',
//     breakfast: [
//       {
//         name: 'Manouche Jebne',
//         protein: 15,
//         calories: 550,
//         image: 'https://lebanoninapicture.com/pages/good-morning-lebanon-from-kobayat-rodny-s/insta_10-11-2016-8-10-47-am-m.jpg'
//       },
//       {
//         name: 'Manouche Zaatar',
//         protein: 8,
//         calories: 280,
//         image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTc7xbtURhtz8h-eugMxlGImDtRHsREBYMVRQ&s'
//       },
//       {
//         name: 'Manouche Jebne Harra',
//         protein: 15,
//         calories: 580,
//         image: 'https://ik.imagekit.io/misterd/tr:w-500,q-90/photo/_3jv0mfjjxi7tqxe_1708511372819_jebne%20harra.png'
//       }
//     ],
//     lunch: [
//       {
//         name: 'Hamburger',
//         protein: 28,
//         calories: 650,
//         image: 'https://recipe-graphics.grocerywebsite.com/0_GraphicsRecipes/4589_4k.jpg'
//       },
//       {
//         name: 'Hot dog Sandwich',
//         protein: 20,
//         calories: 480,
//         image: 'https://www.allrecipes.com/thmb/8M8hZ2LX1w-XTOh5HJBv-9019RQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/244669-blt-dogs-VAT-005-step-04-1-5571c562383e439fbb65be15e15cca01.jpg'
//       },
//       {
//         name: 'Tabbouleh Salad',
//         protein: 4,
//         calories: 170,
//         image: 'https://www.icookstuff.com/posts/450/images/0.jpg'
//       }
//     ],
//     dessert: [
//       {
//         name: 'Foret Noir Cake',
//         protein: 3,
//         calories: 300,
//         image: 'https://new.secretscakes.com/files/width/600/height/600/crop/600x600x0/images/content-images/cakes/foret-noir-8-10-pers.jpg'
//       }
//     ]
//   }
// ];

// // Transform the sampleMenus array to an object keyed by day with _id added
// const STATIC_MENU_BY_DAY = sampleMenus.reduce((acc, dayEntry) => {
//   acc[dayEntry.day] = {};
//   Object.entries(dayEntry).forEach(([key, value]) => {
//     if (CATEGORIES[key]) {
//       acc[dayEntry.day][key] = value.map((item, index) => ({
//         ...item,
//         _id: `${dayEntry.day}-${key}-${index}`
//       }));
//     }
//   });
//   return acc;
// }, {});

// export default function CafeteriaMenu() {
//   const [selectedDay, setSelectedDay] = useState(DAYS[0]);
//   const menu = STATIC_MENU_BY_DAY[selectedDay] || {};

//   const renderItem = ({ item }) => (
//     <Card style={styles.card}>
//       {item.image && <Image source={{ uri: item.image }} style={styles.cardImage} />}
//       <Card.Content>
//         <Title>{item.name}</Title>
//         <View style={styles.chipRow}>
//           <Chip style={styles.chip}>{item.protein}g</Chip>
//           <Chip style={styles.chip}>{item.calories} cal</Chip>
//         </View>
//       </Card.Content>
//     </Card>
//   );

//   return (
//     <PaperProvider>
//       <View style={styles.container}>
//         <View style={styles.dayButtonsWrapper}>
//           <View style={styles.dayButtons}>
//             {DAYS.map((day) => (
//               <Button
//                 key={day}
//                 mode={selectedDay === day ? 'contained' : 'outlined'}
//                 onPress={() => setSelectedDay(day)}
//                 style={styles.dayButton}
//               >
//                 {day}
//               </Button>
//             ))}
//           </View>
//         </View>

//         <FlatList
//           data={Object.keys(CATEGORIES)}
//           keyExtractor={(item) => item}
//           renderItem={({ item }) => (
//             <View style={styles.centeredCategory}>
//               <Text style={styles.categoryTitle}>{CATEGORIES[item].label}</Text>
//               <FlatList
//                 data={menu[item] || []}
//                 keyExtractor={(itm) => itm._id}
//                 renderItem={renderItem}
//                 horizontal
//                 contentContainerStyle={{ justifyContent: 'center' }}
//               />
//             </View>
//           )}
//         />
//       </View>
//     </PaperProvider>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16, backgroundColor: '#fff' },
//   dayButtonsWrapper: { alignItems: 'center', marginBottom: 16 },
//   dayButtons: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
//   dayButton: { marginHorizontal: 4, marginVertical: 4 },
//   categoryTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 16, marginBottom: 8, textAlign: 'center' },
//   centeredCategory: { alignItems: 'center' },
//   card: { margin: 10, width: 250 },
//   cardImage: { height: 120, width: '100%', borderTopLeftRadius: 4, borderTopRightRadius: 4 },
//   chipRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
//   chip: { marginRight: 8 },
// });





// // import React, { useEffect, useState } from 'react';
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   ScrollView,
// //   ActivityIndicator,
// //   TouchableOpacity,
// //   TextInput,
// //   Image,
// //   Alert,
// // } from 'react-native';
// // import {
// //   Card,
// //   Button,
// //   Chip,
// //   Dialog,
// //   Portal,
// //   Provider,
// //   Text as PaperText,
// // } from 'react-native-paper';
// // import { Ionicons, MaterialIcons } from '@expo/vector-icons';
// // import { useAuthStore } from '../../store/AuthStore';

// // const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

// // const CATEGORIES = {
// //   breakfast: { label: 'Breakfast', icon: 'cafe', color: '#FF6B35' },
// //   lunch: { label: 'Lunch', icon: 'fast-food', color: '#4ECDC4' },
// //   dessert: { label: 'Dessert', icon: 'ice-cream', color: '#E17055' },
// // };

// // export default function CafeteriaMenuScreen() {
// //   const { authUser } = useAuthStore();
// //   const isAdmin = authUser?.role === 'admin';
// //   const [selectedDay, setSelectedDay] = useState('Monday');
// //   const [menu, setMenu] = useState(null);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState('');
// //   const [visibleDialog, setVisibleDialog] = useState(false);
// //   const [dialogMode, setDialogMode] = useState('add');
// //   const [currentCategory, setCurrentCategory] = useState('');
// //   const [currentItem, setCurrentItem] = useState({
// //     name: '',
// //     protein: '',
// //     calories: '',
// //     image: ''
// //   });

// //   useEffect(() => {
// //     fetchMenu(selectedDay);
// //   }, [selectedDay]);

// //   const fetchMenu = async (day) => {
// //     setLoading(true);
// //     try {
// //       const res = await fetch(`http://127.0.0.1:5000/api/menu/${day}`);
// //       if (!res.ok) {
// //         setMenu(null);
// //       } else {
// //         const data = await res.json();
// //         setMenu(data);
// //       }
// //     } catch (err) {
// //       setError(err.message);
// //       setMenu(null);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const openItemDialog = (mode, category, item = null) => {
// //     setDialogMode(mode);
// //     setCurrentCategory(category);
// //     setCurrentItem(
// //       item
// //         ? { ...item, protein: String(item.protein), calories: String(item.calories) }
// //         : { name: '', protein: '', calories: '', image: '' }
// //     );
// //     setVisibleDialog(true);
// //   };

// //   const closeDialog = () => setVisibleDialog(false);

// //   const saveItem = async () => {
// //     const url = dialogMode === 'add'
// //       ? `http://127.0.0.1:5000/api/menu/${selectedDay}/${currentCategory}`
// //       : `http://127.0.0.1:5000/api/menu/${selectedDay}/${currentCategory}/${currentItem._id}`;

// //     const method = dialogMode === 'add' ? 'POST' : 'PUT';

// //     try {
// //       const res = await fetch(url, {
// //         method,
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({
// //           name: currentItem.name,
// //           protein: Number(currentItem.protein),
// //           calories: Number(currentItem.calories),
// //           image: currentItem.image
// //         })
// //       });
// //       if (!res.ok) throw new Error('Failed to save item');
// //       await fetchMenu(selectedDay);
// //       closeDialog();
// //     } catch (err) {
// //       Alert.alert('Error', err.message);
// //     }
// //   };

// //   const renderCategory = (categoryKey) => {
// //     const category = CATEGORIES[categoryKey];
// //     const items = menu?.[categoryKey] || [];

// //     return (
// //       <View key={categoryKey} style={{ marginBottom: 24 }}>
// //         <View style={styles.categoryHeader}>
// //           <Ionicons name={category.icon} size={24} color={category.color} />
// //           <Text style={styles.categoryTitle}>{category.label}</Text>
// //           {isAdmin && (
// //             <Button
// //               mode="outlined"
// //               onPress={() => openItemDialog('add', categoryKey)}
// //               style={{ marginLeft: 'auto' }}
// //             >
// //               Add
// //             </Button>
// //           )}
// //         </View>

// //         {items.length > 0 ? (
// //           items.map(item => (
// //             <Card key={item._id} style={styles.card}>
// //               {item.image ? (
// //                 <Image
// //                   source={{ uri: item.image }}
// //                   style={styles.cardImage}
// //                 />
// //               ) : null}
// //               <Card.Content>
// //                 <Text style={styles.itemName}>{item.name}</Text>
// //                 <View style={styles.chipsRow}>
// //                   <Chip icon="arm-flex-outline">{item.protein}g</Chip>
// //                   <Chip icon="fire">{item.calories} cal</Chip>
// //                 </View>
// //                 {isAdmin && (
// //                   <View style={styles.actionsRow}>
// //                     <IconButton icon="pencil" onPress={() => openItemDialog('edit', categoryKey, item)} />
// //                     <IconButton icon="delete" onPress={() => Alert.alert('Delete', 'Not implemented yet')} />
// //                   </View>
// //                 )}
// //               </Card.Content>
// //             </Card>
// //           ))
// //         ) : (
// //           <Text style={{ textAlign: 'center', color: '#aaa' }}>No items yet</Text>
// //         )}
// //       </View>
// //     );
// //   };

// //   return (
// //     <Provider>
// //       <ScrollView contentContainerStyle={styles.container}>
// //         <View style={styles.dayTabs}>
// //           {DAYS.map(day => (
// //             <TouchableOpacity
// //               key={day}
// //               style={[
// //                 styles.dayTab,
// //                 selectedDay === day && styles.activeDayTab
// //               ]}
// //               onPress={() => setSelectedDay(day)}
// //             >
// //               <Text style={styles.dayTabText}>{day}</Text>
// //             </TouchableOpacity>
// //           ))}
// //         </View>

// //         {loading ? (
// //           <ActivityIndicator size="large" style={{ marginTop: 50 }} />
// //         ) : (
// //           <View>
// //             {Object.keys(CATEGORIES).map(renderCategory)}
// //           </View>
// //         )}

// //         <Portal>
// //           <Dialog visible={visibleDialog} onDismiss={closeDialog}>
// //             <Dialog.Title>{dialogMode === 'add' ? 'Add Item' : 'Edit Item'}</Dialog.Title>
// //             <Dialog.Content>
// //               <TextInput
// //                 label="Name"
// //                 value={currentItem.name}
// //                 onChangeText={text => setCurrentItem({ ...currentItem, name: text })}
// //                 style={styles.input}
// //               />
// //               <TextInput
// //                 label="Protein (g)"
// //                 value={currentItem.protein}
// //                 keyboardType="numeric"
// //                 onChangeText={text => setCurrentItem({ ...currentItem, protein: text })}
// //                 style={styles.input}
// //               />
// //               <TextInput
// //                 label="Calories"
// //                 value={currentItem.calories}
// //                 keyboardType="numeric"
// //                 onChangeText={text => setCurrentItem({ ...currentItem, calories: text })}
// //                 style={styles.input}
// //               />
// //               <TextInput
// //                 label="Image URL"
// //                 value={currentItem.image}
// //                 onChangeText={text => setCurrentItem({ ...currentItem, image: text })}
// //                 style={styles.input}
// //               />
// //             </Dialog.Content>
// //             <Dialog.Actions>
// //               <Button onPress={closeDialog}>Cancel</Button>
// //               <Button onPress={saveItem}>Save</Button>
// //             </Dialog.Actions>
// //           </Dialog>
// //         </Portal>
// //       </ScrollView>
// //     </Provider>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     padding: 16
// //   },
// //   dayTabs: {
// //     flexDirection: 'row',
// //     justifyContent: 'center',
// //     marginBottom: 16,
// //     flexWrap: 'wrap',
// //   },
// //   dayTab: {
// //     padding: 8,
// //     margin: 4,
// //     borderWidth: 1,
// //     borderRadius: 8,
// //     borderColor: '#ccc',
// //   },
// //   activeDayTab: {
// //     backgroundColor: '#4ECDC4',
// //     borderColor: '#4ECDC4'
// //   },
// //   dayTabText: {
// //     color: '#000'
// //   },
// //   categoryHeader: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginBottom: 8,
// //   },
// //   categoryTitle: {
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //     marginLeft: 8
// //   },
// //   card: {
// //     marginVertical: 8
// //   },
// //   cardImage: {
// //     width: '100%',
// //     height: 200,
// //     resizeMode: 'cover',
// //   },
// //   itemName: {
// //     fontSize: 16,
// //     fontWeight: '600',
// //     marginVertical: 4
// //   },
// //   chipsRow: {
// //     flexDirection: 'row',
// //     gap: 8,
// //     marginVertical: 4
// //   },
// //   actionsRow: {
// //     flexDirection: 'row',
// //     justifyContent: 'flex-end'
// //   },
// //   input: {
// //     marginVertical: 8
// //   }
// // });

//-------------------------------------------------------------------------------------------------------------
//best version

// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   FlatList,
//   Image,
//   StyleSheet,
//   ActivityIndicator,
// } from 'react-native';
// import {
//   Button,
//   Card,
//   Chip,
//   Text,
//   Title,
//   Provider as PaperProvider,
// } from 'react-native-paper';
// import { useAuthStore } from '../../store/AuthStore';

// const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
// const CATEGORIES = {
//   breakfast: { label: 'Breakfast', color: '#FF6B35' },
//   lunch: { label: 'Lunch', color: '#4ECDC4' },
//   dessert: { label: 'Dessert', color: '#E17055' },
// };

// export default function CafeteriaMenu() {
//   const [selectedDay, setSelectedDay] = useState(DAYS[0]);
//   const [menu, setMenu] = useState({});
//   const [loading, setLoading] = useState(false);
//   const { authUser } = useAuthStore();

//   const fetchMenu = async (day) => {
//     try {
//       setLoading(true);
//       const response = await fetch(`http://localhost:5000/api/menu/${day}`, {
//         headers: {
//           Authorization: `Bearer ${authUser?.token}`,
//         },
//       });
//       if (!response.ok) {
//         throw new Error('Failed to fetch menu');
//       }
//       const data = await response.json();
//       setMenu(data);
//     } catch (error) {
//       console.error('Error fetching menu:', error.message);
//       setMenu({ breakfast: [], lunch: [], dessert: [] }); // fallback
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMenu(selectedDay);
//   }, [selectedDay]);

//   const renderItem = ({ item }) => (
//     <Card style={styles.card}>
//       {item.image && <Image source={{ uri: item.image }} style={styles.cardImage} />}
//       <Card.Content>
//         <Title>{item.name}</Title>
//         <View style={styles.chipRow}>
//           <Chip style={styles.chip}>{item.protein}g</Chip>
//           <Chip style={styles.chip}>{item.calories} cal</Chip>
//         </View>
//       </Card.Content>
//     </Card>
//   );

//   return (
//     <PaperProvider>
//       <View style={styles.container}>
//         <View style={styles.dayButtonsWrapper}>
//           <View style={styles.dayButtons}>
//             {DAYS.map((day) => (
//               <Button
//                 key={day}
//                 mode={selectedDay === day ? 'contained' : 'outlined'}
//                 onPress={() => setSelectedDay(day)}
//                 style={styles.dayButton}
//               >
//                 {day}
//               </Button>
//             ))}
//           </View>
//         </View>

//         {loading ? (
//           <ActivityIndicator size="large" />
//         ) : (
//           <FlatList
//             data={Object.keys(CATEGORIES)}
//             keyExtractor={(item) => item}
//             renderItem={({ item }) => (
//               <View style={styles.centeredCategory}>
//                 <Text style={styles.categoryTitle}>{CATEGORIES[item].label}</Text>
//                 <FlatList
//                   data={menu[item] || []}
//                   keyExtractor={(itm, index) => itm._id || `${item}-${index}`}
//                   renderItem={renderItem}
//                   horizontal
//                   contentContainerStyle={{ justifyContent: 'center' }}
//                 />
//               </View>
//             )}
//           />
//         )}
//       </View>
//     </PaperProvider>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16, backgroundColor: '#fff' },
//   dayButtonsWrapper: { alignItems: 'center', marginBottom: 16 },
//   dayButtons: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
//   dayButton: { marginHorizontal: 4, marginVertical: 4 },
//   categoryTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 16, marginBottom: 8, textAlign: 'center' },
//   centeredCategory: { alignItems: 'center' },
//   card: { margin: 10, width: 250 },
//   cardImage: { height: 120, width: '100%', borderTopLeftRadius: 4, borderTopRightRadius: 4 },
//   chipRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
//   chip: { marginRight: 8 },
// });



// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   FlatList,
//   Image,
//   StyleSheet,
//   ActivityIndicator,
//   TextInput,
// } from 'react-native';
// import {
//   Button,
//   Card,
//   Chip,
//   Text,
//   Title,
//   IconButton,
//   Modal,
//   Portal,
//   Provider as PaperProvider,
// } from 'react-native-paper';
// import { useAuthStore } from '../../store/AuthStore';

// const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
// const CATEGORIES = {
//   breakfast: { label: 'Breakfast', color: '#FF6B35' },
//   lunch: { label: 'Lunch', color: '#4ECDC4' },
//   dessert: { label: 'Dessert', color: '#E17055' },
// };

// export default function CafeteriaMenu() {
//   const [selectedDay, setSelectedDay] = useState(DAYS[0]);
//   const [menu, setMenu] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [editingItem, setEditingItem] = useState(null);
//   const [editModalVisible, setEditModalVisible] = useState(false);
//   const { authUser } = useAuthStore();

//   const fetchMenu = async (day) => {
//     try {
//       setLoading(true);
//       const response = await fetch(`http://localhost:5000/api/menu/${day}`, {
//         headers: {
//           Authorization: `Bearer ${authUser?.token}`,
//         },
//       });
//       if (!response.ok) throw new Error('Failed to fetch menu');
//       const data = await response.json();
//       setMenu(data);
//     } catch (error) {
//       console.error('Error fetching menu:', error.message);
//       setMenu({ breakfast: [], lunch: [], dessert: [] });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMenu(selectedDay);
//   }, [selectedDay]);

//   const handleEdit = (item, category) => {
//     setEditingItem({ ...item, category });
//     setEditModalVisible(true);
//   };

//   const handleSave = async () => {
//     try {
//       const { _id, name, protein, calories, image, category } = editingItem;
//       const response = await fetch(
//         `http://localhost:5000/api/menu/${selectedDay}/${category}/${_id}`,
//         {
//           method: 'PUT',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${authUser?.token}`,
//           },
//           body: JSON.stringify({ name, protein, calories, image }),
//         }
//       );
//       if (!response.ok) throw new Error('Failed to update item');
//       await fetchMenu(selectedDay);
//       setEditModalVisible(false);
//       setEditingItem(null);
//     } catch (err) {
//       console.error(err.message);
//     }
//   };

//   const renderItem = (category) => ({ item }) => (
//     <Card style={styles.card}>
//       {item.image && <Image source={{ uri: item.image }} style={styles.cardImage} />}
//       <Card.Content>
//         <Title>{item.name}</Title>
//         <View style={styles.chipRow}>
//           <Chip style={styles.chip}>{item.protein}g</Chip>
//           <Chip style={styles.chip}>{item.calories} cal</Chip>
//         </View>
//         {authUser?.role === 'admin' && (
//           <IconButton
//             icon="pencil"
//             size={20}
//             onPress={() => handleEdit(item, category)}
//             style={styles.editIcon}
//           />
//         )}
//       </Card.Content>
//     </Card>
//   );

//   return (
//     <PaperProvider>
//       <View style={styles.container}>
//         <View style={styles.dayButtonsWrapper}>
//           <View style={styles.dayButtons}>
//             {DAYS.map((day) => (
//               <Button
//                 key={day}
//                 mode={selectedDay === day ? 'contained' : 'outlined'}
//                 onPress={() => setSelectedDay(day)}
//                 style={styles.dayButton}
//               >
//                 {day}
//               </Button>
//             ))}
//           </View>
//         </View>

//         {loading ? (
//           <ActivityIndicator size="large" />
//         ) : (
//           <FlatList
//             data={Object.keys(CATEGORIES)}
//             keyExtractor={(item) => item}
//             renderItem={({ item }) => (
//               <View style={styles.centeredCategory}>
//                 <Text style={styles.categoryTitle}>{CATEGORIES[item].label}</Text>
//                 <FlatList
//                   data={menu[item] || []}
//                   keyExtractor={(itm) => itm._id}
//                   renderItem={renderItem(item)}
//                   horizontal
//                   contentContainerStyle={{ justifyContent: 'center' }}
//                 />
//               </View>
//             )}
//           />
//         )}

//         {/* Edit Modal */}
//         <Portal>
//           <Modal
//             visible={editModalVisible}
//             onDismiss={() => setEditModalVisible(false)}
//             contentContainerStyle={styles.modalContainer}
//           >
//             <Text style={styles.modalTitle}>Edit Item</Text>
//             <TextInput
//               placeholder="Name"
//               value={editingItem?.name}
//               onChangeText={(text) => setEditingItem({ ...editingItem, name: text })}
//               style={styles.input}
//             />
//             <TextInput
//               placeholder="Protein (g)"
//               keyboardType="numeric"
//               value={editingItem?.protein?.toString()}
//               onChangeText={(text) =>
//                 setEditingItem({ ...editingItem, protein: Number(text) })
//               }
//               style={styles.input}
//             />
//             <TextInput
//               placeholder="Calories"
//               keyboardType="numeric"
//               value={editingItem?.calories?.toString()}
//               onChangeText={(text) =>
//                 setEditingItem({ ...editingItem, calories: Number(text) })
//               }
//               style={styles.input}
//             />
//             <TextInput
//               placeholder="Image URL"
//               value={editingItem?.image}
//               onChangeText={(text) => setEditingItem({ ...editingItem, image: text })}
//               style={styles.input}
//             />
//             <Button mode="contained" onPress={handleSave} style={{ marginTop: 10 }}>
//               Save
//             </Button>
//           </Modal>
//         </Portal>
//       </View>
//     </PaperProvider>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16, backgroundColor: '#fff' },
//   dayButtonsWrapper: { alignItems: 'center', marginBottom: 16 },
//   dayButtons: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
//   dayButton: { marginHorizontal: 4, marginVertical: 4 },
//   categoryTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 16, marginBottom: 8, textAlign: 'center' },
//   centeredCategory: { alignItems: 'center' },
//   card: { margin: 10, width: 250 },
//   cardImage: { height: 120, width: '100%', borderTopLeftRadius: 4, borderTopRightRadius: 4 },
//   chipRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
//   chip: { marginRight: 8 },
//   editIcon: { position: 'absolute', top: 4, right: 4 },
//   modalContainer: {
//     backgroundColor: 'white',
//     padding: 20,
//     marginHorizontal: 20,
//     borderRadius: 10,
//   },
//   modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 8,
//     marginBottom: 10,
//     borderRadius: 6,
//   },
// });




import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import {
  Button,
  Card,
  Chip,
  Text,
  Title,
  IconButton,
  Modal,
  Portal,
  Provider as PaperProvider,
} from 'react-native-paper';
import { useAuthStore } from '../../store/AuthStore';
import Constants from 'expo-constants';
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const CATEGORIES = {
  breakfast: { label: 'Breakfast', color: '#FF6B35' },
  lunch: { label: 'Lunch', color: '#4ECDC4' },
  dessert: { label: 'Dessert', color: '#E17055' },
};

export default function CafeteriaMenu() {
  const [selectedDay, setSelectedDay] = useState(DAYS[0]);
  const [menu, setMenu] = useState({});
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', calories: '', protein: '', image: '', category: '' });

  const { authUser } = useAuthStore();

  const fetchMenu = async (day) => {
    try {
      setLoading(true);
      const response = await fetch(`${Constants.expoConfig.extra.API_BASE_URL}/menu/${day}`, {
        headers: {
          Authorization: `Bearer ${authUser?.token}`,
        },
      });
      const data = await response.json();
      setMenu(data);
    } catch (error) {
      console.error('Fetch menu error:', error.message);
      setMenu({ breakfast: [], lunch: [], dessert: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu(selectedDay);
  }, [selectedDay]);

  const handleEdit = (item, category) => {
    setEditingItem({ ...item, category });
    setEditModalVisible(true);
  };

  const handleSave = async () => {
    const { _id, name, protein, calories, image, category } = editingItem;
    try {
      await fetch(`${Constants.expoConfig.extra.API_BASE_URL}/menu/${selectedDay}/${category}/${_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authUser?.token}`,
        },
        body: JSON.stringify({ name, protein, calories, image }),
      });
      await fetchMenu(selectedDay);
      setEditModalVisible(false);
    } catch (err) {
      console.error('Update error:', err.message);
    }
  };

  const handleDelete = async (itemId, category) => {
    try {
      await fetch(`${Constants.expoConfig.extra.API_BASE_URL}/menu/${selectedDay}/${category}/${itemId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authUser?.token}`,
        },
      });
      await fetchMenu(selectedDay);
    } catch (err) {
      console.error('Delete error:', err.message);
    }
  };

  const handleAddItem = async () => {
    const { name, protein, calories, image, category } = newItem;
    try {
      await fetch(`${Constants.expoConfig.extra.API_BASE_URL}/menu/${selectedDay}/${category}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authUser?.token}`,
        },
        body: JSON.stringify({ name, protein: Number(protein), calories: Number(calories), image }),
      });
      await fetchMenu(selectedDay);
      setAddModalVisible(false);
      setNewItem({ name: '', protein: '', calories: '', image: '', category: '' });
    } catch (err) {
      console.error('Add error:', err.message);
    }
  };

  const renderItem = (category) => ({ item }) => (
    <Card style={styles.card}>
      {item.image && <Image source={{ uri: item.image }} style={styles.cardImage} />}
      <Card.Content>
        <Title>{item.name}</Title>
        <View style={styles.chipRow}>
          <Chip>{item.protein}g</Chip>
          <Chip>{item.calories} cal</Chip>
        </View>
        {authUser?.role === 'admin' && (
          <View style={styles.iconRow}>
            <IconButton icon="pencil" size={20} onPress={() => handleEdit(item, category)} />
            <IconButton icon="delete" size={20} onPress={() => handleDelete(item._id, category)} />
          </View>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <PaperProvider>
      <View style={styles.container}>
        <View style={styles.dayButtonsWrapper}>
          <View style={styles.dayButtons}>
            {DAYS.map((day) => (
              <Button
                key={day}
                mode={selectedDay === day ? 'contained' : 'outlined'}
                onPress={() => setSelectedDay(day)}
                style={styles.dayButton}
              >
                {day}
              </Button>
            ))}
          </View>
        </View>

        {authUser?.role === 'admin' && (
          <Button mode="contained" onPress={() => setAddModalVisible(true)} style={{ marginBottom: 10 }}>
            + Add New Item
          </Button>
        )}

        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <FlatList
            data={Object.keys(CATEGORIES)}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <View style={styles.centeredCategory}>
                <Text style={styles.categoryTitle}>{CATEGORIES[item].label}</Text>
                <FlatList
                  data={menu[item] || []}
                  keyExtractor={(itm) => itm._id}
                  renderItem={renderItem(item)}
                  horizontal
                  contentContainerStyle={{ justifyContent: 'center' }}
                />
              </View>
            )}
          />
        )}

        {/* Edit Modal */}
        <Portal>
          <Modal visible={editModalVisible} onDismiss={() => setEditModalVisible(false)} contentContainerStyle={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Item</Text>
            <TextInput style={styles.input} placeholder="Name" value={editingItem?.name} onChangeText={(text) => setEditingItem({ ...editingItem, name: text })} />
            <TextInput style={styles.input} placeholder="Protein" keyboardType="numeric" value={editingItem?.protein?.toString()} onChangeText={(text) => setEditingItem({ ...editingItem, protein: Number(text) })} />
            <TextInput style={styles.input} placeholder="Calories" keyboardType="numeric" value={editingItem?.calories?.toString()} onChangeText={(text) => setEditingItem({ ...editingItem, calories: Number(text) })} />
            <TextInput style={styles.input} placeholder="Image URL" value={editingItem?.image} onChangeText={(text) => setEditingItem({ ...editingItem, image: text })} />
            <Button mode="contained" onPress={handleSave} style={{ marginTop: 10 }}>Save</Button>
          </Modal>
        </Portal>

        {/* Add Modal */}
        <Portal>
          <Modal visible={addModalVisible} onDismiss={() => setAddModalVisible(false)} contentContainerStyle={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add New Food</Text>
            <TextInput style={styles.input} placeholder="Name" value={newItem.name} onChangeText={(text) => setNewItem({ ...newItem, name: text })} />
            <TextInput style={styles.input} placeholder="Protein" keyboardType="numeric" value={newItem.protein} onChangeText={(text) => setNewItem({ ...newItem, protein: text })} />
            <TextInput style={styles.input} placeholder="Calories" keyboardType="numeric" value={newItem.calories} onChangeText={(text) => setNewItem({ ...newItem, calories: text })} />
            <TextInput style={styles.input} placeholder="Image URL" value={newItem.image} onChangeText={(text) => setNewItem({ ...newItem, image: text })} />
            <TextInput style={styles.input} placeholder="Category (breakfast/lunch/dessert)" value={newItem.category} onChangeText={(text) => setNewItem({ ...newItem, category: text })} />
            <Button mode="contained" onPress={handleAddItem} style={{ marginTop: 10 }}>Add</Button>
          </Modal>
        </Portal>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  dayButtonsWrapper: { alignItems: 'center', marginBottom: 16 },
  dayButtons: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  dayButton: { marginHorizontal: 4, marginVertical: 4 },
  categoryTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 16, marginBottom: 8, textAlign: 'center' },
  centeredCategory: { alignItems: 'center' },
  card: { margin: 10, width: 250 },
  cardImage: { height: 120, width: '100%', borderTopLeftRadius: 4, borderTopRightRadius: 4 },
  chipRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  chip: { marginRight: 8 },
  iconRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 10,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 10,
    borderRadius: 6,
  },
});
