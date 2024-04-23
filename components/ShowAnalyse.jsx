import React from "react";
import { View, StyleSheet, Image, Text } from "react-native";
import Header from "./Header";

import TotalIcon from "../assets/up-and-down-arrows.png";
import IncomeIcon from "../assets/passive-income.png";
import EmployeeExpenseIcon from "../assets/career.png";
import DepenseIcon from "../assets/depenser-de-largent.png"

const ShowAnalyse = ({ total, totalEmp, totalDepense, totalRevenu }) => {
  
  const renderLabels = () => {
    const labels = [
        {
          title: "Solde Total",
          description: total,
          icon: TotalIcon,
        },
        {
          title: "Total Dépense",
          description: totalDepense,
          icon: DepenseIcon,
        },
        {
          title: "Total Revenu",
          description: totalRevenu,
          icon: IncomeIcon,
        },
        {
          title: "Total Dépense de l'employé",
          description: totalEmp,
          icon: EmployeeExpenseIcon,
        },
      ];
      
    return labels.map((item, index) => (
      <View key={index} style={styles.labelContainer}>
        <View style={styles.titleContainer}>
        <View style={[styles.line,{ backgroundColor: item.title === "Solde Total" ? "black" : (item.description > 0 ? "green" : "rgb(244 63 94)")}]} />
          <Text style={[styles.title,{ color: item.title === "Solde Total" ? "black" : (item.description > 0 ? "green" : "rgb(244 63 94)")}]} >
            {item.title}
          </Text>
          <View style={[styles.line,{ backgroundColor: item.title === "Solde Total" ? "black" : (item.description > 0 ? "green" : "rgb(244 63 94)")}]} />
        </View>
        <View style={[styles.itemContainer, { backgroundColor: item.title === "Solde Total" ? "black" : (item.description > 0 ? "green" : "rgb(244 63 94)"), padding : item.title==="Solde Total" ? 15 : 0 }]}>
          <View style={styles.iconContainer}>
            {item.icon && <Image source={item.icon} style={styles.icon} />}
          </View>
          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>{item.description} MAD</Text>
          </View>
        </View>
      </View>
    ));
  };

  return <View style={styles.mainContainer}>{renderLabels()}</View>;
};

const styles = StyleSheet.create({
  labelContainer: {
    marginBottom: 20,
  },
  itemContainer: {
    borderRadius: 40,
    borderColor: "#ccc",
    alignSelf: "center",
    alignItems: "center",
    shadowColor: "gray",
    flexDirection: "row",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 6,
    width: "80%",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf:"center",
    width:"90%",
    marginBottom:8
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  line: {
    flex: 1,
    height: 1,
  },
  iconContainer: {
    marginRight: 10,
    borderRadius: 100,
    backgroundColor: "rgb(250 250 250)",
    padding: 10,
  },
  icon: {
    width: 40,
    height: 40,
  },
  descriptionContainer: {
    flex: 1,
    marginRight: 20,
  },
  description: {
    fontSize: 26,
    fontWeight: "bold",
    alignSelf: "center",
    color: "white",
  },
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ShowAnalyse;
