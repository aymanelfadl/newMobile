import notifee from '@notifee/react-native';

export async function newEmployeeMsg() {
    try {
      const idChannel =  await notifee.createChannel({
          id: 'employee_channel',
          name: 'Canal des employés',
        });
  
      await notifee.displayNotification({
        title: 'Nouvel employé',
        body: 'Un nouvel employé a été embauché.',
        android: {
          channelId: 'employee_channel',
        },
      });
    } catch (error) {
      console.error('Erreur lors de l\'affichage de la notification :', error);
    }
  }
  
export async function newDepenseMsg() {
    try {
      const idChannel = await notifee.createChannel({
          id: 'depense_channel',
          name: 'Canal des dépenses',
        });
  
      await notifee.displayNotification({
        title: 'Nouvelle dépense',
        body: 'Une nouvelle dépense a été ajoutée.',
        android: {
          channelId: 'depense_channel',
        },
      });
    } catch (error) {
      console.error('Erreur lors de l\'affichage de la notification :', error);
    }
  }
  
export async function newRevenuMsg() {
    try {

      const idChannel = await notifee.createChannel({
          id: 'revenue_channel',
          name: 'Canal des revenus',
        });
        
      await notifee.displayNotification({
        title: 'Nouveau revenu',
        body: 'Un nouveau revenu a été généré.',
        android: {
          channelId: 'revenue_channel',
        },
      });
    } catch (error) {
      console.error('Erreur lors de l\'affichage de la notification :', error);
    }
  }
  