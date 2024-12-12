export class BackupRecoveryManager {
    static async recoverBackup(backupData) {
        try {
            await this.restoreData(backupData);
            console.log("Recuperación de backup completada con éxito");
        } catch (error) {
            console.error("Error en la recuperación del backup:", error);
        }
    }


    static async restoreData(file) {
        try {
            const formData = new FormData();
            formData.append('backupFile', file);

            const response = await fetch('/api/database/restore', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Error al restaurar la base de datos');
            }

            const result = await response.text();
            console.log('Base de datos restaurada con éxito:', result);
        } catch (error) {
            console.error('Error al restaurar la base de datos:', error);
            throw error;
        }
    }

}

