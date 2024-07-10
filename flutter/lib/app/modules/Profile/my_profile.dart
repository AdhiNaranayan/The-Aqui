
import 'dart:math';

import 'package:aquila_hundi/app/helper_widgets/appbar.dart';
import 'package:aquila_hundi/app/helper_widgets/bottom_navigation.dart';
import 'package:aquila_hundi/app/helper_widgets/config.dart';
import 'package:aquila_hundi/app/modules/Dashboard/dashboard_page.dart';
import 'package:aquila_hundi/store/app.state.dart';
import 'package:aquila_hundi/store/business/business.action.dart';
import 'package:aquila_hundi/store/dashboard/dashboard.action.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_redux/flutter_redux.dart';
import 'package:redux/redux.dart';
import 'package:dropdown_search/dropdown_search.dart';


class MyProfilePage extends StatefulWidget {
  const MyProfilePage({super.key});

  @override
  MyProfilePageState createState() => MyProfilePageState();
}

class MyProfilePageState extends State<MyProfilePage> {
  final GlobalKey<ScaffoldState> scaffoldKey = GlobalKey<ScaffoldState>(); 
  int screenIndex = -1;

  void openDrawer() {
    scaffoldKey.currentState!.openDrawer();
  }

  void onEditProfilePage() {
    //
  }

   @override
  Widget build(BuildContext context) {
     if (StoreProvider.of<AppState>(context).state.dashboardState.customerCurrentScreen == 'Buyer') {
    SystemChrome.setSystemUIOverlayStyle(const SystemUiOverlayStyle(
      statusBarColor:  Color.fromARGB(255, 47, 14, 138),
      statusBarIconBrightness: Brightness.light,
    ));
    } else {
      SystemChrome.setSystemUIOverlayStyle(const SystemUiOverlayStyle(
        statusBarColor: Colors.orange,
        statusBarIconBrightness: Brightness.dark,
      ));
    }

    return StoreConnector<AppState, Store<AppState>>(
      converter: (store) => store,
      builder: (BuildContext context, store) {
        final customerCurrentScreen = store.state.dashboardState.customerCurrentScreen;
        final customerData = store.state.authState.customerData;
        final screenWidth = MediaQuery.of(context).size.width;
        return Scaffold(
            key: scaffoldKey,
            appBar: PreferredSize(
            preferredSize:  BoxConstraints.tightFor(height: AppConfig.size(context, 45)).smallest,
            child: WidgetHelper.getAppBar(context, 'Invoices', openDrawer, customerCurrentScreen == 'Seller' ? Colors.orange : Colors.deepPurple.shade900, onEditProfilePage),
          ),
      bottomNavigationBar: const BottomNavigation(),
    drawer: WidgetHelper.leftNavigationBar(context, screenIndex, customerData['ContactName'], customerData['Mobile'], customerCurrentScreen == 'Seller' ? Colors.orange : Colors.deepPurple.shade900),
    body: SingleChildScrollView(
      child: Column(
        children: <Widget>[
          Container(
            padding: EdgeInsets.only(left: screenWidth * 0.05, right: screenWidth * 0.05, top: AppConfig.size(context, 20)),
            child: Column(
              children: <Widget>[
                // show avatar with option to edit either by selecting image from gallery or from camera
                Container(
                  width: screenWidth * 0.3,
                  height: screenWidth * 0.3,
                  decoration: const BoxDecoration(
                    shape: BoxShape.circle,
                    image: DecorationImage(
                      image: AssetImage('assets/images/avatar.png'),
                      fit: BoxFit.fill,
                    ),
                  ),
                ),
                SizedBox(height: AppConfig.size(context, 10)),
                Text(
                  customerData['ContactName'],
                  style: TextStyle(
                    fontSize: AppConfig.size(context, 20),
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
         ),
        ),
        ],
      ),
    ),
        );

      }
    );
  }
}