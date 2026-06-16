import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  Pressable,
  Platform,
  Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import Svg, { Circle } from 'react-native-svg';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useBookStore, Book } from '../store/useBookStore';


export default function App() {
  const store = useBookStore();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'library' | 'reading' | 'stats'>('library');

  // Interactive UI State
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isOptionsModalVisible, setIsOptionsModalVisible] = useState<Book | null>(null);

  // Add Book Form State
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newPages, setNewPages] = useState('');
  const [newCategory, setNewCategory] = useState('التصوف والروحانيات');

  // Reading Mode State
  const [currentReadingPage, setCurrentReadingPage] = useState(1);
  const totalReadingPages = 15;

  // Reading Goal Circle Params
  const radius = 88;
  const circumference = 2 * Math.PI * radius;
  const goalPercentage = 0.70; // 70%
  const strokeDashoffset = circumference - goalPercentage * circumference;

  const handleAddBook = () => {
    if (!newTitle.trim() || !newAuthor.trim() || !newPages.trim()) {
      Alert.alert('تنبيه', 'الرجاء تعبئة جميع الحقول المطلوبة');
      return;
    }
    const pagesNum = parseInt(newPages);
    if (isNaN(pagesNum) || pagesNum <= 0) {
      Alert.alert('تنبيه', 'الرجاء إدخال عدد صفحات صحيح');
      return;
    }
    store.addBook(newTitle, newAuthor, pagesNum, newCategory);
    setNewTitle('');
    setNewAuthor('');
    setNewPages('');
    setIsAddModalVisible(false);
  };

  const handleDeleteBook = (bookId: string) => {
    store.deleteBook(bookId);
    setIsOptionsModalVisible(null);
  };

  const handleUpdateProgress = (bookId: string, value: number) => {
    store.updateBookProgress(bookId, value);
    if (selectedBook && selectedBook.id === bookId) {
      setSelectedBook({ ...selectedBook, progress: value });
    }
  };

  return (
    <View style={styles.mainContainer}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Top Navigation Bar (AppBar) */}
      <View style={[styles.appBar, { paddingTop: insets.top, height: 64 + insets.top }]}>
        <View style={styles.appBarRight}>
          <TouchableOpacity style={styles.menuIconButton}>
            <Ionicons name="menu-outline" size={24} color="#4734c3" />
          </TouchableOpacity>
          <Text style={styles.appBarTitle}>مكتبتي</Text>
        </View>
        
        <TouchableOpacity style={styles.profileContainer}>
          <Image
            source="https://lh3.googleusercontent.com/aida-public/AB6AXuAMP_Q8I05PODNiVkl0-wyqFCy2G0veUGHj_bpbiRMEXYGCaySXtdzf9wY4I9kFjwTYtTShRzNhEdlhyPw8hM_59EZ_Ppq11AN_ri8OsRqlCJq0YZ5a41fYDLCpEIN4TS3GvNdHSEeb6aMYQZHNXL7byGaBDxinPJ9RQZ8RnWJ8pUU3yG9CPCZbiHB4ubv2o6JkSwOFYmziCKN61eNcTZIjt4Gzlo-gX6ia6y7fv0F4a1bIgZTPl3oD3bJj3kXRqZQDTLA6llDoluw"
            style={styles.profileImage}
            contentFit="cover"
          />
        </TouchableOpacity>
      </View>

      {/* Main Canvas Area */}
      <View style={styles.container}>
        {activeTab === 'library' && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            
            {/* Reading Goal Progress Ring Section */}
            <View style={styles.progressSection}>
              <View style={styles.svgWrapper}>
                <Svg width={192} height={192} style={styles.progressRingSvg}>
                  {/* Background track circle */}
                  <Circle
                    cx="96"
                    cy="96"
                    r={radius}
                    fill="transparent"
                    stroke="#eee7df"
                    strokeWidth="8"
                  />
                  {/* Foreground progress circle */}
                  <Circle
                    cx="96"
                    cy="96"
                    r={radius}
                    fill="transparent"
                    stroke="#4734c3"
                    strokeWidth="8"
                    strokeDasharray={circumference.toString()}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                  />
                </Svg>
                
                {/* Text centered inside the circle */}
                <View style={styles.progressTextContainer}>
                  <Text style={styles.progressPercentageText}>70%</Text>
                  <Text style={styles.progressLabelText}>هدف القراءة</Text>
                </View>
              </View>
              
              <Text style={styles.goalDescriptionText}>
                أكملت <Text style={styles.boldPrimaryText}>{store.readingGoalCompleted} كتب</Text> من أصل {store.readingGoalTarget} هذا العام
              </Text>
            </View>

            {/* Current Reads List */}
            <View style={styles.readsSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>أقرأ الآن</Text>
                <Text style={styles.booksCountBadge}>{store.books.length} كتاب</Text>
              </View>

              {/* Book Cards */}
              <View style={styles.booksListContainer}>
                {store.books.map((book, index) => (
                  <Pressable
                    key={book.id}
                    style={styles.bookCard}
                    onPress={() => router.push(`/details/${book.id}`)}
                  >
                    {/* Zellige style colored accent bar at top of card */}
                    <View 
                      style={[
                        styles.zelligeBorder, 
                        { backgroundColor: index % 2 === 0 ? '#4734c3' : '#9f402d' }
                      ]} 
                    />
                    
                    <View style={styles.bookCardInner}>
                      {/* Book Cover */}
                      <View style={styles.bookCoverContainer}>
                        <Image
                          source={book.coverImage}
                          style={styles.bookCover}
                          contentFit="cover"
                        />
                      </View>

                      {/* Book Details */}
                      <View style={styles.bookDetails}>
                        <Text style={styles.bookTitle} numberOfLines={1}>{book.title}</Text>
                        <Text style={styles.bookAuthor}>{book.author}</Text>
                        
                        <View style={styles.progressRow}>
                          <View style={styles.progressBarBg}>
                            <View style={[styles.progressBarFill, { width: `${book.progress}%` }]} />
                          </View>
                          <Text style={styles.progressPercentageVal}>{book.progress}%</Text>
                        </View>
                      </View>

                      {/* Options Button */}
                      <TouchableOpacity 
                        style={styles.optionsButton} 
                        onPress={() => setIsOptionsModalVisible(book)}
                      >
                        <Ionicons name="ellipsis-vertical" size={20} color="#787586" />
                      </TouchableOpacity>
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>
            
            <View style={{ height: 120 }} />
          </ScrollView>
        )}

        {/* Standalone Reading View (Inspired by Reading View Screen) */}
        {activeTab === 'reading' && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <View style={styles.readingHeader}>
              <Text style={styles.readingTitle}>منطق الطير</Text>
              <Text style={styles.readingSubtitle}>فريد الدين العطار • الصفحة {currentReadingPage} من {totalReadingPages}</Text>
            </View>

            <View style={styles.readingContentCard}>
              <Text style={styles.arabicReadingParagraph}>
                مرحبا بك في وادي الطلب، أول وادٍ في طريق البحث. عندما تدخل هذا الوادي، ستواجه مئات الصعاب والمحن. عليك أن تبذل جهدك وتتخلى عن مالك وجاهك، وتكرس حياتك للطلب والبحث المستمر دون ملل أو كلل.
              </Text>
              <Text style={styles.arabicReadingVerse}>
                عزم همت جو تفكر رهنما {"\n"}
                تا بتابد نور عشق از كبريا
              </Text>
              <Text style={styles.readingTranslationParagraph}>
                {"\"إذا طلبت طريق السلوك، فاجعل عزمك مرشدك، وتفكر في آيات الكبرياء حتى يشرق عليك نور العشق الإلهي...\""}
              </Text>
            </View>

            <View style={styles.readingControls}>
              <TouchableOpacity 
                style={[styles.readingPageBtn, currentReadingPage === 1 && styles.disabledBtn]}
                disabled={currentReadingPage === 1}
                onPress={() => setCurrentReadingPage(currentReadingPage - 1)}
              >
                <Ionicons name="arrow-forward" size={20} color={currentReadingPage === 1 ? '#c8c4d7' : '#ffffff'} />
                <Text style={[styles.readingPageBtnText, currentReadingPage === 1 && styles.disabledBtnText]}>الصفحة السابقة</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.readingPageBtn, currentReadingPage === totalReadingPages && styles.disabledBtn]}
                disabled={currentReadingPage === totalReadingPages}
                onPress={() => setCurrentReadingPage(currentReadingPage + 1)}
              >
                <Text style={[styles.readingPageBtnText, currentReadingPage === totalReadingPages && styles.disabledBtnText]}>الصفحة التالية</Text>
                <Ionicons name="arrow-back" size={20} color={currentReadingPage === totalReadingPages ? '#c8c4d7' : '#ffffff'} />
              </TouchableOpacity>
            </View>
            
            <View style={{ height: 100 }} />
          </ScrollView>
        )}

        {/* Stats View (Inspired by Stats Screen) */}
        {activeTab === 'stats' && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <Text style={styles.sectionTitle}>إحصائيات القراءة</Text>

            <View style={styles.statSummaryCard}>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>180</Text>
                <Text style={styles.statLabel}>دقيقة مقروءة</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>3</Text>
                <Text style={styles.statLabel}>أيام متتالية</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>التقدم الأسبوعي</Text>
            <View style={styles.chartContainer}>
              <View style={styles.chartBars}>
                {[45, 60, 20, 0, 30, 45, 10].map((mins, idx) => {
                  const days = ['ن', 'ث', 'ر', 'خ', 'ج', 'س', 'ح'];
                  const heightPct = Math.min(100, (mins / 60) * 100);
                  return (
                    <View key={idx} style={styles.chartCol}>
                      <View style={styles.chartTrack}>
                        <View style={[styles.chartFill, { height: `${heightPct}%` }]} />
                      </View>
                      <Text style={styles.chartDay}>{days[idx]}</Text>
                    </View>
                  );
                })}
              </View>
            </View>

            <View style={{ height: 100 }} />
          </ScrollView>
        )}
      </View>

      {/* Floating Action Button (FAB) */}
      {activeTab === 'library' && (
        <TouchableOpacity 
          style={styles.fabButton}
          onPress={() => setIsAddModalVisible(true)}
        >
          <Ionicons name="add" size={26} color="#ffffff" />
        </TouchableOpacity>
      )}

      {/* Bottom Navigation Bar */}
      <View style={[styles.navigationBar, { paddingBottom: insets.bottom, height: 72 + insets.bottom }]}>
        <TouchableOpacity 
          style={[styles.navItem, activeTab === 'stats' && styles.navItemActive]}
          onPress={() => setActiveTab('stats')}
        >
          <Ionicons name="stats-chart-outline" size={22} color={activeTab === 'stats' ? '#4734c3' : '#474554'} />
          <Text style={[styles.navText, activeTab === 'stats' && styles.navTextActive]}>إحصائيات</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navItem, activeTab === 'reading' && styles.navItemActive]}
          onPress={() => setActiveTab('reading')}
        >
          <Ionicons name="book-outline" size={22} color={activeTab === 'reading' ? '#4734c3' : '#474554'} />
          <Text style={[styles.navText, activeTab === 'reading' && styles.navTextActive]}>القراءة</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navItem, activeTab === 'library' && styles.navItemActive]}
          onPress={() => setActiveTab('library')}
        >
          <Ionicons name="library-outline" size={22} color={activeTab === 'library' ? '#4734c3' : '#474554'} />
          <Text style={[styles.navText, activeTab === 'library' && styles.navTextActive]}>مكتبتي</Text>
        </TouchableOpacity>
      </View>

      {/* Book Detail / Progress Adjustment Modal */}
      {selectedBook && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={true}
          onRequestClose={() => setSelectedBook(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setSelectedBook(null)}>
                  <Ionicons name="close" size={24} color="#1e1b17" />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>تفاصيل الكتاب</Text>
                <View style={{ width: 24 }} />
              </View>

              <ScrollView contentContainerStyle={[styles.modalScroll, { paddingBottom: insets.bottom + 24 }]}>
                <View style={styles.modalCoverCard}>
                  <Image source={selectedBook.coverImage} style={styles.modalBookCover} contentFit="cover" />
                  <Text style={styles.modalBookTitle}>{selectedBook.title}</Text>
                  <Text style={styles.modalBookAuthor}>{selectedBook.author}</Text>
                  <View style={styles.categoryChip}>
                    <Text style={styles.categoryChipText}>{selectedBook.category}</Text>
                  </View>
                </View>

                <View style={styles.modalDescCard}>
                  <Text style={styles.modalSectionTitle}>عن الكتاب</Text>
                  <Text style={styles.modalDescText}>{selectedBook.description}</Text>
                </View>

                <View style={styles.modalProgressCard}>
                  <Text style={styles.modalSectionTitle}>تعديل تقدم القراءة</Text>
                  <View style={styles.progressControls}>
                    <TouchableOpacity 
                      style={styles.adjustBtn}
                      onPress={() => handleUpdateProgress(selectedBook.id, Math.max(0, selectedBook.progress - 5))}
                    >
                      <Ionicons name="remove" size={20} color="#4734c3" />
                    </TouchableOpacity>

                    <View style={styles.numericProgress}>
                      <Text style={styles.progressValText}>{selectedBook.progress}%</Text>
                      <Text style={styles.progressSubValText}>
                        {Math.round((selectedBook.progress / 100) * selectedBook.pages)} من {selectedBook.pages} صفحة
                      </Text>
                    </View>

                    <TouchableOpacity 
                      style={styles.adjustBtn}
                      onPress={() => handleUpdateProgress(selectedBook.id, Math.min(100, selectedBook.progress + 5))}
                    >
                      <Ionicons name="add" size={20} color="#4734c3" />
                    </TouchableOpacity>
                  </View>

                  <View style={[styles.progressBarBg, { marginTop: 15, height: 8 }]}>
                    <View style={[styles.progressBarFill, { width: `${selectedBook.progress}%` }]} />
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}

      {/* Options/More Modal */}
      {isOptionsModalVisible && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={true}
          onRequestClose={() => setIsOptionsModalVisible(null)}
        >
          <Pressable style={styles.modalOverlay} onPress={() => setIsOptionsModalVisible(null)}>
            <View style={styles.optionsModalContent}>
              <Text style={styles.optionsModalTitle}>{isOptionsModalVisible.title}</Text>
              
              <TouchableOpacity 
                style={styles.optionsModalItem}
                onPress={() => {
                  setSelectedBook(isOptionsModalVisible);
                  setIsOptionsModalVisible(null);
                }}
              >
                <Ionicons name="book-outline" size={20} color="#4734c3" style={{ marginLeft: 10 }} />
                <Text style={styles.optionsModalItemText}>عرض التفاصيل</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.optionsModalItem, styles.deleteOptionItem]}
                onPress={() => handleDeleteBook(isOptionsModalVisible.id)}
              >
                <Ionicons name="trash-outline" size={20} color="#9f402d" style={{ marginLeft: 10 }} />
                <Text style={styles.deleteOptionItemText}>إزالة من الرف</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Modal>
      )}

      {/* Add Book Modal */}
      {isAddModalVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={true}
          onRequestClose={() => setIsAddModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setIsAddModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#1e1b17" />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>إضافة كتاب جديد</Text>
                <View style={{ width: 24 }} />
              </View>

              <ScrollView contentContainerStyle={[styles.modalScroll, { paddingBottom: insets.bottom + 24 }]}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>عنوان الكتاب *</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="مثال: طوق الحمامة"
                    placeholderTextColor="#787586"
                    value={newTitle}
                    onChangeText={setNewTitle}
                    textAlign="right"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>اسم الكاتب *</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="مثال: ابن حزم الأندلسي"
                    placeholderTextColor="#787586"
                    value={newAuthor}
                    onChangeText={setNewAuthor}
                    textAlign="right"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>عدد الصفحات *</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="مثال: 240"
                    placeholderTextColor="#787586"
                    keyboardType="numeric"
                    value={newPages}
                    onChangeText={setNewPages}
                    textAlign="right"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>التصنيف</Text>
                  <View style={styles.categoriesSelectRow}>
                    {['التصوف والروحانيات', 'الفلسفة الإسلامية', 'الأدب والشعر'].map((cat) => (
                      <TouchableOpacity
                        key={cat}
                        style={[
                          styles.catSelectBadge,
                          newCategory === cat && styles.catSelectBadgeActive
                        ]}
                        onPress={() => setNewCategory(cat)}
                      >
                        <Text
                          style={[
                            styles.catSelectBadgeText,
                            newCategory === cat && styles.catSelectBadgeTextActive
                          ]}
                        >
                          {cat}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <TouchableOpacity style={styles.submitBtn} onPress={handleAddBook}>
                  <Text style={styles.submitBtnText}>إضافة الكتاب</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FDFBF7', // Overridden for Mediterranean theme
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  // Top App Bar
  appBar: {
    height: 64,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee7df',
    ...Platform.select({
      ios: {
        shadowColor: '#4734c3',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  appBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuIconButton: {
    padding: 6,
    borderRadius: 9999,
  },
  appBarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4734c3',
    fontFamily: Platform.select({ ios: 'Geeza Pro', android: 'sans-serif' }),
  },
  profileContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#c8c4d7',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },

  // Reading Goal Progress Section
  progressSection: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 36,
  },
  svgWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressRingSvg: {
    transform: [{ rotate: '-90deg' }],
  },
  progressTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressPercentageText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#4734c3',
  },
  progressLabelText: {
    fontSize: 12,
    color: '#787586',
    marginTop: 2,
    fontFamily: Platform.select({ ios: 'Geeza Pro', android: 'sans-serif' }),
  },
  goalDescriptionText: {
    fontSize: 15,
    color: '#474554',
    textAlign: 'center',
    marginTop: 20,
    fontFamily: Platform.select({ ios: 'Geeza Pro', android: 'sans-serif' }),
  },
  boldPrimaryText: {
    fontWeight: 'bold',
    color: '#4734c3',
  },

  // Current Reads List Section
  readsSection: {
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e1b17',
    fontFamily: Platform.select({ ios: 'Geeza Pro', android: 'sans-serif' }),
  },
  booksCountBadge: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#4734c3',
    fontFamily: Platform.select({ ios: 'Geeza Pro', android: 'sans-serif' }),
  },
  booksListContainer: {
    gap: 16,
  },
  bookCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#4734c3',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
    }),
    borderWidth: 1,
    borderColor: '#eee7df',
  },
  zelligeBorder: {
    height: 4,
    width: '100%',
  },
  bookCardInner: {
    flexDirection: 'row-reverse',
    padding: 16,
    alignItems: 'center',
  },
  bookCoverContainer: {
    width: 64,
    height: 90,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#faf2ea',
    borderWidth: 1,
    borderColor: '#eee7df',
  },
  bookCover: {
    width: '100%',
    height: '100%',
  },
  bookDetails: {
    flex: 1,
    marginRight: 16,
    alignItems: 'flex-end',
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e1b17',
    fontFamily: Platform.select({ ios: 'Geeza Pro', android: 'sans-serif' }),
  },
  bookAuthor: {
    fontSize: 13,
    color: '#787586',
    marginTop: 4,
    fontFamily: Platform.select({ ios: 'Geeza Pro', android: 'sans-serif' }),
  },
  progressRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  progressBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: '#faf2ea',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#005a40',
    borderRadius: 3,
  },
  progressPercentageVal: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#005a40',
    width: 30,
    textAlign: 'left',
  },
  optionsButton: {
    padding: 8,
    marginLeft: -8,
  },

  // Floating Action Button (FAB)
  fabButton: {
    position: 'absolute',
    bottom: 96,
    left: 24,
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: '#4734c3',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4734c3',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 5,
    zIndex: 50,
  },

  // Bottom Navigation Bar
  navigationBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 72,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#eee7df',
    flexDirection: 'row-reverse',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 0,
    shadowColor: '#4734c3',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 40,
  },
  navItem: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  navItemActive: {
    backgroundColor: '#e7e2ff',
    borderRadius: 24,
  },
  navText: {
    fontSize: 11,
    color: '#474554',
    marginTop: 2,
    fontFamily: Platform.select({ ios: 'Geeza Pro', android: 'sans-serif' }),
  },
  navTextActive: {
    color: '#4734c3',
    fontWeight: 'bold',
  },

  // Reading Mode Styles
  readingHeader: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  readingTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e1b17',
    fontFamily: Platform.select({ ios: 'Geeza Pro', android: 'sans-serif' }),
  },
  readingSubtitle: {
    fontSize: 13,
    color: '#787586',
    marginTop: 4,
    fontFamily: Platform.select({ ios: 'Geeza Pro', android: 'sans-serif' }),
  },
  readingContentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#eee7df',
    padding: 24,
    marginBottom: 24,
    shadowColor: '#4734c3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
  },
  arabicReadingParagraph: {
    fontSize: 16,
    color: '#1e1b17',
    lineHeight: 28,
    textAlign: 'right',
    fontFamily: Platform.select({ ios: 'Geeza Pro', android: 'sans-serif' }),
  },
  arabicReadingVerse: {
    fontSize: 16,
    color: '#9f402d',
    textAlign: 'center',
    marginVertical: 20,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  readingTranslationParagraph: {
    fontSize: 14,
    color: '#474554',
    lineHeight: 22,
    textAlign: 'right',
    fontStyle: 'italic',
    borderTopWidth: 1,
    borderTopColor: '#faf2ea',
    paddingTop: 16,
  },
  readingControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  readingPageBtn: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4734c3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  readingPageBtnText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
    fontFamily: Platform.select({ ios: 'Geeza Pro', android: 'sans-serif' }),
  },
  disabledBtn: {
    backgroundColor: '#faf2ea',
    borderWidth: 1,
    borderColor: '#eee7df',
  },
  disabledBtnText: {
    color: '#c8c4d7',
  },

  // Stats View Styles
  statSummaryCard: {
    flexDirection: 'row-reverse',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#eee7df',
    padding: 20,
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4734c3',
  },
  statLabel: {
    fontSize: 12,
    color: '#787586',
    marginTop: 4,
    fontFamily: Platform.select({ ios: 'Geeza Pro', android: 'sans-serif' }),
  },
  statDivider: {
    width: 1,
    backgroundColor: '#eee7df',
  },
  chartContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#eee7df',
    padding: 20,
    height: 160,
  },
  chartBars: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: '100%',
  },
  chartCol: {
    alignItems: 'center',
    flex: 1,
  },
  chartTrack: {
    width: 14,
    height: 90,
    backgroundColor: '#faf2ea',
    borderRadius: 7,
    justifyContent: 'flex-end',
  },
  chartFill: {
    width: '100%',
    backgroundColor: '#4734c3',
    borderRadius: 7,
  },
  chartDay: {
    fontSize: 11,
    color: '#787586',
    marginTop: 8,
    fontFamily: Platform.select({ ios: 'Geeza Pro', android: 'sans-serif' }),
  },

  // Modals Overlay & Common Sheet
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(30, 27, 23, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FDFBF7',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    minHeight: '60%',
    borderWidth: 1,
    borderColor: '#eee7df',
  },
  modalHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#eee7df',
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e1b17',
    fontFamily: Platform.select({ ios: 'Geeza Pro', android: 'sans-serif' }),
  },
  modalScroll: {
    padding: 24,
  },

  // Book Details Modal Styles
  modalCoverCard: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#eee7df',
    padding: 24,
    marginBottom: 20,
  },
  modalBookCover: {
    width: 90,
    height: 126,
    borderRadius: 8,
    backgroundColor: '#faf2ea',
  },
  modalBookTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e1b17',
    marginTop: 16,
    fontFamily: Platform.select({ ios: 'Geeza Pro', android: 'sans-serif' }),
  },
  modalBookAuthor: {
    fontSize: 14,
    color: '#787586',
    marginTop: 4,
    fontFamily: Platform.select({ ios: 'Geeza Pro', android: 'sans-serif' }),
  },
  categoryChip: {
    backgroundColor: '#e7e2ff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 12,
  },
  categoryChipText: {
    fontSize: 11,
    color: '#4734c3',
    fontWeight: 'bold',
    fontFamily: Platform.select({ ios: 'Geeza Pro', android: 'sans-serif' }),
  },
  modalDescCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#eee7df',
    padding: 20,
    marginBottom: 20,
  },
  modalSectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1e1b17',
    marginBottom: 8,
    textAlign: 'right',
    fontFamily: Platform.select({ ios: 'Geeza Pro', android: 'sans-serif' }),
  },
  modalDescText: {
    fontSize: 13,
    color: '#474554',
    lineHeight: 22,
    textAlign: 'right',
    fontFamily: Platform.select({ ios: 'Geeza Pro', android: 'sans-serif' }),
  },
  modalProgressCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#eee7df',
    padding: 20,
    marginBottom: 40,
  },
  adjustBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e7e2ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  numericProgress: {
    alignItems: 'center',
  },
  progressValText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e1b17',
  },
  progressSubValText: {
    fontSize: 12,
    color: '#787586',
    marginTop: 2,
    fontFamily: Platform.select({ ios: 'Geeza Pro', android: 'sans-serif' }),
  },
  progressControls: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },

  // Options Menu Sheet
  optionsModalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#eee7df',
  },
  optionsModalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e1b17',
    marginBottom: 20,
    textAlign: 'right',
    fontFamily: Platform.select({ ios: 'Geeza Pro', android: 'sans-serif' }),
  },
  optionsModalItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    height: 52,
    borderBottomWidth: 1,
    borderBottomColor: '#faf2ea',
  },
  optionsModalItemText: {
    fontSize: 14,
    color: '#1e1b17',
    fontFamily: Platform.select({ ios: 'Geeza Pro', android: 'sans-serif' }),
  },
  deleteOptionItem: {
    borderBottomWidth: 0,
  },
  deleteOptionItemText: {
    fontSize: 14,
    color: '#9f402d',
    fontWeight: 'bold',
    fontFamily: Platform.select({ ios: 'Geeza Pro', android: 'sans-serif' }),
  },

  // Add Book Inputs
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e1b17',
    marginBottom: 8,
    textAlign: 'right',
    fontFamily: Platform.select({ ios: 'Geeza Pro', android: 'sans-serif' }),
  },
  textInput: {
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#c8c4d7',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    color: '#1e1b17',
    fontSize: 14,
  },
  categoriesSelectRow: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  catSelectBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#c8c4d7',
  },
  catSelectBadgeActive: {
    backgroundColor: '#e7e2ff',
    borderColor: '#4734c3',
  },
  catSelectBadgeText: {
    fontSize: 12,
    color: '#474554',
    fontFamily: Platform.select({ ios: 'Geeza Pro', android: 'sans-serif' }),
  },
  catSelectBadgeTextActive: {
    color: '#4734c3',
    fontWeight: 'bold',
  },
  submitBtn: {
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4734c3',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: Platform.select({ ios: 'Geeza Pro', android: 'sans-serif' }),
  }
});
