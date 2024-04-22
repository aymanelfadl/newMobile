import React, { useState, useEffect, cloneElement } from "react";
import { View, StyleSheet } from "react-native";
import firestore from "@react-native-firebase/firestore";

import Header from "../components/Header";
import ShowAnalyse from "../components/ShowAnalyse";

const AnalyseScreen = () => {
  const [totalDepense, setTotalDepense] = useState(0);
  const [totalTRevenu, setTotalRevenu] = useState(0);
  const [totaleDepenseEmp, setTotalDepenseEmp] = useState(0);
    
  const getTotalDepenses = () => {
    const unsubscribe = firestore().collection('DepensesCollection').onSnapshot(snapshot => {
      let totalSpends = 0;
      snapshot.forEach(depense => {
        totalSpends -= Number(depense.data().spends);  
      });
      setTotalDepense(totalSpends);
    });
  
    return unsubscribe;
  };
  
  const getTotalRevenus = () => {
    const unsubscribe = firestore().collection('RevenusCollection').onSnapshot(snapshot => {
      let totalRevenus = 0;
      snapshot.forEach(revenu => {
        totalRevenus +=Number(revenu.data().spends);  
      });
      setTotalRevenu(totalRevenus);
    });
  
    return unsubscribe;
  };
  
  const getTotalEmployes = () => {
    const unsubscribe = firestore().collection('EmployesCollection').onSnapshot(snapshot => {
      let totalEmployes = 0;
      snapshot.forEach(employe => {
        totalEmployes -=Number( employe.data().spends );  
      });
      setTotalDepenseEmp(totalEmployes);
    });
  

    return unsubscribe;
  };
  
  useEffect(() => {
    getTotalDepenses();
    getTotalEmployes();
    getTotalRevenus();
  }, []); 


  return (
    <View style={styles.container}>
      <Header title={"Analyse"} />
      <ShowAnalyse total={totalDepense + totalTRevenu + totaleDepenseEmp} totalDepense={totalDepense} totalRevenu={totalTRevenu} totalEmp={totaleDepenseEmp} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    margin: 0,
    backgroundColor: 'rgb(249 250 251)',
  },
});

export default AnalyseScreen;
